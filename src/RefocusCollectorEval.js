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
const utils = require('./evalUtils');
const errors = require('./errors');
const commonUtils = require('./common');
const u = require('util');
const schema = require('./schema');

const SAMPLE_BODY_MAX_LEN = 4096;

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
   * @returns {Array} - Array of zero or more samples.
   * @throws {ArgsError} - if thrown by validateTransformArgs function
   * @throws {FunctionBodyError} - if thrown by safeEval function or if function
   *  body is not a string
   * @throws {TransformError} - if transform does not return valid array of
   *  samples
   */
  static safeTransform(functionBody, args) {
    debug('Entered evalUtils.safeTransform', args);
    if (typeof functionBody !== 'string') {
      const msg = 'Transform function body must be a string';
      throw new errors.FunctionBodyError(msg);
    }

    utils.validateTransformArgs(args);
    args.SAMPLE_BODY_MAX_LEN = SAMPLE_BODY_MAX_LEN;
    const retval = utils.safeEval(functionBody, args);
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
   * @returns {String} - The generated url as a string
   * @throws {ToUrlError} - if transform function does not return an array
   *  of zero or more samples
   * @throws {ArgsError} - if thrown by validateToUrlArgs function
   * @throws {FunctionBodyError} - if thrown by safeEval function or if function
   *  body is not a string
   */
  static safeToUrl(functionBody, args) {
    debug('Entered evalUtils.safeToUrl', args);
    if (typeof functionBody !== 'string') {
      const msg = 'toUrl function body must be a string';
      throw new errors.FunctionBodyError(msg);
    }

    utils.validateToUrlArgs(args);
    const retval = utils.safeEval(functionBody, args);
    if (typeof retval !== 'string') {
      throw new errors.ToUrlError(commonUtils.ERROR_MESSAGE.TO_URL.NOT_STRING);
    }

    debug('evalUtils.safeToUrl returning: ${retval}');
    return retval;
  } // safeToUrl

  /*
   * Returns the transform function for the given status, based on this order
   * of precedence:
   * (1) the first status code match from transform.errorHandlers
   * (2) transform.default (for status 2xx only)
   * (3) false
   *
   * @param {Object} transform - the sample generator template's transform object.
   * @param {String} status - Status code.
   * @returns {Any} a transform function or false
   */
  static getTransformFunction(transform, status) {
    /*
     * First check for a status match in transform.errorHandlers (including any
     * "override" for any 2xx status the template may define).
     */
    if (transform.errorHandlers) {
      /*
       * Sort the errorHandlers keys alphabetically so there's a predictable
       * order of evaluation, since we return the "first" match.
       */
      const statusMatchers = Object.keys(transform.errorHandlers).sort();
      for (let i = 0; i < statusMatchers.length; i++) {
        const re = new RegExp(statusMatchers[i]);
        if (re.test(status)) {
          return transform.errorHandlers[statusMatchers[i]];
        }
      }
    }

    /*
     * There is no errorHandler defined for this status. If the status is 2xx,
     * use transform.default.
     */
    if (/2\\d\\d/.test(status)) {
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
}

module.exports = RefocusCollectorEval;
