/**
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * src/RefocusCollectorEval.js
 */
const debug = require('debug')('refocus-collector-eval:main');
const acceptParser = require('accept-parser');
const utils = require('./evalUtils');
const errors = require('./errors');
const commonUtils = require('./common');
const ajv = require('ajv')({ jsonPointers: true });
const u = require('util');
const schema = require('./schema');
const RADIX = 10;
const SAMPLE_BODY_MAX_LEN = 4096;
const ACCEPT = 'Accept';
const MIME_SUBTYPE_SEPARATOR = '/';
const CONTENT_TYPE_SEPARATOR = ';';
/* Node request forces response headers to lower case. */
const CONTENT_TYPE = 'content-type';

/**
 * Checks whether the actual content type matches this particular accepted
 * type.
 *
 * @param {Object} acc - one of the array elements returned by parsing the
 *  Accept headers using "accept-parser"
 * @param {Object} actual - An object representing the actual content type
 *  received, with attributes ["contentType", "type", "subtype"]
 * @returns {Boolean} true if the actual content type matches this particular
 *  "Accept" entry, either an exact match or a wildcard match
 */
function acceptMatcher(acc, actual) {
  /* Exact match or full wildcard match on both type and subtype */
  if (actual.contentType === acc.item || acc.item === '*/*') return true;

  /* Otherwise check for "*" wildcard matches */
  const a = acc.item.split(MIME_SUBTYPE_SEPARATOR);
  const accepted = {
    type: a[0],
    subtype: a[1],
  };

  /* Exact match type, wildcard subtype */
  if (actual.type === accepted.type && accepted.subtype === '*') {
    return true;
  }

  /* Wildcard type, exact match subtype */
  if (accepted.type === '*' && accepted.subtype === actual.subtype) {
    return true;
  }
} // acceptMatcher

class RefocusCollectorEval {
  /**
   * Safely executes the transform function with the arguments provided.
   *
   * @param {String} functionBody - The transform function body as provided by
   *  the sample generator template. The function body may refer to the args ctx,
   *  res and subjects directly.
   * @param {Object} args - An object containing the following attributes:
   *  {Object} ctx - The sample generator context.
   *  {Object} res - The response object returned by calling the remote data
   *    source.
   *  {Array} aspects - Array of one or more aspects.
   *  {Array} subjects - An array of one or more subjects.
   * @param {Boolean} allowLogging - Allow logging from within the transform.
   * @returns {Array} - Array of zero or more samples.
   * @throws {ArgsError} - if thrown by validateTransformArgs function
   * @throws {FunctionBodyError} - if thrown by safeEval function or if function
   *  body is not a string
   * @throws {TransformError} - if transform does not return valid array of
   *  samples
   */
  static safeTransform(functionBody, args, allowLogging=false) {
    debug('Entered evalUtils.safeTransform', args);
    if (typeof functionBody !== 'string') {
      const msg = 'Transform function body must be a string';
      throw new errors.FunctionBodyError(msg);
    }

    utils.validateTransformArgs(args);
    args.SAMPLE_BODY_MAX_LEN = SAMPLE_BODY_MAX_LEN;
    const retval = utils.safeEval(functionBody, args, allowLogging);
    if (retval) {
      debug('safeTransform generated %d samples: %j', retval.length, retval);
    }

    utils.validateSamples(retval, args);
    debug('evalUtils.safeTransform returning %d samples: %j', retval.length,
      retval);
    return retval;
  } // safeTransform

  /**
   * Safely executes the toUrl function with the arguments provided.
   *
   * @param {String} functionBody - The toUrl function body as provided by the
   *  sample generator template.
   * @param {Object} args - An object containing the following attributes:
   *  {Object} ctx - The sample generator context.
   *  {Array} aspects - Array of one or more aspects.
   *  {Array} subjects - Array of one or more subjects.
   * @param {Boolean} allowLogging - Allow logging from within the transform.
   * @returns {String} - The generated url as a string
   * @throws {ToUrlError} - if transform function does not return an array
   *  of zero or more samples
   * @throws {ArgsError} - if thrown by validateToUrlArgs function
   * @throws {FunctionBodyError} - if thrown by safeEval function or if function
   *  body is not a string
   */
  static safeToUrl(functionBody, args, allowLogging=false) {
    debug('Entered evalUtils.safeToUrl', args);
    if (typeof functionBody !== 'string') {
      const msg = 'toUrl function body must be a string';
      throw new errors.FunctionBodyError(msg);
    }

    utils.validateToUrlArgs(args);
    const retval = utils.safeEval(functionBody, args, allowLogging);
    if (typeof retval !== 'string') {
      throw new errors.ToUrlError(commonUtils.ERROR_MESSAGE.TO_URL.NOT_STRING);
    }

    debug('evalUtils.safeToUrl returning: ${retval}');
    return retval;
  } // safeToUrl

  /*
   * Returns the transform function for the given status, based on this order
   * of precedence:
   * (1) an exact match from transform.errorHandlers
   * (2) the first regex match from transform.errorHandlers
   * (3) transform.default (for status 2xx only)
   * (4) false
   *
   * @param {Object} transform - the sample generator template's transform object.
   * @param {String} status - Status code.
   * @returns {Any} a transform function or false
   */
  static getTransformFunction(transform, status) {
    if (transform.errorHandlers) {
      /*
       * First check for a status match in transform.errorHandlers (including
       * any "override" for any 2xx status the template may define).
       * Exact matches trump regex matches. Sort the errorHandlers keys
       * alphabetically so there's a predictable order of evaluation, since we
       * return the "first" regex match if there is no exact match.
       */
      const statusMatchers = Object.keys(transform.errorHandlers).sort();
      let regexMatch = false;
      for (let i = 0; i < statusMatchers.length; i++) {
        const sm = statusMatchers[i];
        /* Short circuit for exact match */
        if (sm.toString() === status.toString()) {
          return transform.errorHandlers[sm];
        }

        /*
         * Check for regex match if we haven't already found one, but even if
         * we find one, keep looping over the rest of the keys in case there's
         * an exact match.
         */
        if (!regexMatch) {
          const re = new RegExp(sm);
          if (re.test(status)) {
            regexMatch = transform.errorHandlers[sm];
          }
        }
      }

      /*
       * Finished iterating, so we know there was no exact match. If we found
       * a regex match, return that one.
       */
      if (regexMatch) return regexMatch;
    }

    /*
     * There is no errorHandler defined for this status. If the status is 2xx,
     * use transform.default.
     */
    if (/2\d\d/.test(status)) {
      return transform.default;
    }

    /* There is no errorHandler and this is NOT a 2xx status. */
    return false;
  } // getTransformFunction

  /**
   * Schema for sample validation
   * @return {Object} - Joi object
   */
  static get sampleSchema() {
    return schema.sample;
  }

  /**
   * Prepares url of the remote datasource either by expanding the url or by
   * calling the toUrl function specified in the generator template.
   *
   * @param {Object} ctx - The context from the generator
   * @param {Array} aspects - The aspects from the generator
   * @param {Array} subjects - The subjects from the generator
   * @param {Object} connection - The connection obj from the generatorTemplate
   * @param {Boolean} allowLogging - Allow logging from within the transform.
   * @returns {String} - Url to the remote datasource
   * @throws {ValidationError} if connection does not provide url or
   *  toUrl
   */
  static prepareUrl(ctx, aspects, subjects, connection, allowLogging=false) {
    debug('prepareUrl', connection, ctx, aspects, subjects);
    let preparedUrl;
    const { url, toUrl } = connection;
    if (url) {
      ctx.aspects = aspects;
      ctx.subjects = subjects;
      preparedUrl = utils.expand(url, ctx);
    } else if (toUrl) {
      const args = {
        ctx,
        aspects,
        subjects,
      };
      const fbody = Array.isArray(toUrl) ? toUrl.join('\n') : toUrl;
      preparedUrl = this.safeToUrl(fbody, args, allowLogging);
    } else {
      throw new errors.ValidationError('The generator template must provide ' +
        'either a connection.url attribute or a "toUrl" attribute.');
    }

    debug('prepareUrl returning %s', preparedUrl);
    return preparedUrl;
  } // prepareUrl

  /**
   * Prepares the headers to send by expanding the connection headers specified
   * by the generator template.
   *
   * @param {Object} headers - The headers from generator template connection
   *  specification
   * @param {Object} context - The context from the generator
   * @returns {Object} - the headers object
   */
  static prepareHeaders(headers, ctx) {
    debug('prepareHeaders', headers, ctx);
    const retval = {
      Accept: 'application/json', // default
    };
    if (headers && typeof headers === 'object') {
      const hkeys = Object.keys(headers);
      hkeys.forEach((key) => {
        retval[key] = utils.expand(headers[key], ctx);
      });
    }

    debug('exiting prepareHeaders', retval);
    return retval;
  } // prepareHeaders

  /**
   * Validates the mime type of the response based on the "Accept" header from
   * the Sample Generator Template's "connection".
   *
   * @param {Object} sgtHeaders - The headers specified by the Sample Generator
   *  Template "connection"
   * @param {Objects} responseHeaders - The response headers
   * @returns {Boolean} true if the SGT connection does not specify an "Accept"
   *  header, OR if the response does not include a "Content-Type" header, OR
   *  if the array of mime types specified by the SGT connection's "Accept"
   *  header includes the actual "Content-Type" response header.
   * @throws {Error} if the Sample Generator Template connection specifies an
   *  "Accept" header AND the response contains a "Content-Type" header AND the
   *  actual content type does not match one of the accepted mime types.
   */
  static validateResponseType(sgtHeaders, responseHeaders) {
    debug('validateResponseType', sgtHeaders, responseHeaders);
    /*
     * Short circuit return true if no Accept header or no Content-Type header
     * in the response.
     */
    if (!sgtHeaders || !sgtHeaders.hasOwnProperty(ACCEPT) ||
      !responseHeaders || !responseHeaders.hasOwnProperty(CONTENT_TYPE)) {
      return true;
    }

    const acceptedTypes = acceptParser.parse(sgtHeaders[ACCEPT]);
    debug('Parsed Accept headers', acceptedTypes);
    /* Content-Type may contain optional parameters after ";" - ignore them. */
    const contentType = responseHeaders[CONTENT_TYPE]
      .split(CONTENT_TYPE_SEPARATOR)[0].trim();
    debug('validateResponseType Accept:', sgtHeaders[ACCEPT],
      'Content-Type:', contentType);
    const c  = contentType.split(MIME_SUBTYPE_SEPARATOR);
    const actual = {
      contentType,
      type: c[0],
      subtype: c[1],
    };
    /* Do any of the "Accept" values match? */
    if (acceptedTypes.some((acceptedType) =>
      acceptMatcher(acceptedType, actual))) return true;

    // No matches...
    throw new errors.ValidationError(
      `Accept ${sgtHeaders[ACCEPT]} but got ${contentType}`
    );
  } // validateResponseType

  static validateResponseBody(res, schema) {
    debug('validateResponseBody', res, schema);
    if (typeof schema !== 'string') {
      throw new errors.ValidationError(
        'Response validation failed - schema must be a string'
      );
    }

    if (typeof res !== 'object') {
      throw new errors.ValidationError(
        'Response validation failed - res must be an object'
      );
    }

    try {
      schema = JSON.parse(schema);
    } catch (err) {
      throw new errors.ValidationError(
        'Response validation failed - schema must be valid JSON'
      );
    }

    if (!ajv.validate(schema, res)) {
      const err = ajv.errors[0];
      err.dataPath = err.dataPath || '/'; // log root path as "/"
      throw new errors.ValidationError(
        `Response validation failed - ${err.dataPath} - ${err.message}`
      );
    }
  } // validateResponseBody

  /**
   * Returns an object after doing the variable expansion based on the context.
   *
   * @param {Object} object - Object that needs to expand
   * @param {Object} ctx - The context from the generator
   * @returns {Object} - expanded object
   */
  static expandObject(object, ctx) {
    function doTraverse(obj) {
      for (let key in obj) {
        if (typeof obj[key] === 'object') {
          doTraverse(obj[key]);
        } else {
          if (typeof obj[key] === 'string') {
            obj[key] = utils.expand(obj[key], ctx);
          }
        }
      }

      return obj;
    }

    let expandedObject = JSON.parse(JSON.stringify(object));
    expandedObject = doTraverse(expandedObject);
    return expandedObject;
  } // expandObject
}

module.exports = RefocusCollectorEval;
