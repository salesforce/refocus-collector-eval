/**
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * src/evalUtils.js
 */

const debug = require('debug')('refocus-collector-eval:utils');
const evalValidation = require('./evalValidation');
const errors = require('./errors');
const logger = require('winston');
const sampleSchema = require('./schema').sample;
const commonUtils = require('./common');
const { VM } = require('vm2');

const EVAL_TIMEOUT_MILLIS = 750;

module.exports = {
  /**
   * Validate the sample for these conditions:
   * 1) Number of samples < no. of subjects * no. of aspects.
   * 2) Sample aspect is in aspect array given in generator.
   * 3) Sample subject is in subjects provided in generator.
   * 4) No duplicates samples.
   * @param  {Array} sampleArr - Sample array
   * @param  {Object} generator - Generator object
   * @throws {TransformError} - if transform function does not return an array
   *  of zero or more samples
   * @throws {ValidationError} - if any of the above mentioned check fails
   */
  validateSamples: (sampleArr, generator) => {
    debug('Entered evalUtils.validateSamples');
    if (!Array.isArray(sampleArr)) {
      throw new errors.TransformError(
        commonUtils.ERROR_MESSAGE.TRANSFORM.NOT_ARRAY
      );
    }

    let subjectArr; // array of subject absolute paths
    let aspectArr; // array of aspect names

    if (generator.subjects) {
      subjectArr = generator.subjects.map(s => s.absolutePath.toLowerCase());
    } else if (generator.subject) {
      subjectArr = [generator.subject.absolutePath.toLowerCase()];
    } else {
      throw new errors.ValidationError(
        'Generator passed to validateSamples should have "subjects" or "subject"'
      );
    }

    // create aspect array, generator will have aspects attribute always
    aspectArr = generator.aspects.map(a => a.name.toLowerCase());

    // no of samples should not exceed the (no. of subjects * the no. of aspects)
    if (sampleArr.length > subjectArr.length * aspectArr.length) {
      throw new errors.ValidationError('Number of samples more than expected. ' +
        `Samples count: ${sampleArr.length}, Subjects count: ` +
        `${subjectArr.length}, Aspects count: ${aspectArr.length}`);
    }

    const uniqueSamples = new Set();
    sampleArr.forEach((samp) => {
      const val = sampleSchema.validate(samp);
      if (val.error) {
        throw new errors.TransformError(val.error.message);
      }

      const sampName = samp.name;
      const sampNameLowerCase = sampName.toLowerCase();

      // check for duplicate samples
      if (uniqueSamples.has(sampNameLowerCase)) {
        throw new errors.ValidationError(
          `Duplicate sample found: ${sampNameLowerCase}`
        );
      }

      uniqueSamples.add(sampNameLowerCase);

      // Check that samples corresponds to only the subjects and aspects passed in
      const subAspArr = sampNameLowerCase.split('|');
      if (subAspArr.length === 2) {
        const subjName = subAspArr[0];
        const aspName = subAspArr[1];
        if ((!subjectArr.includes(subjName)) || (!aspectArr.includes(aspName))) {
          throw new errors.ValidationError(
            `Unknown subject or aspect for sample: ${sampName}`
          );
        }
      } else {
        throw new errors.ValidationError(`Invalid sample name: ${sampName}`);
      }
    });
    debug('Sample validation passed; Exiting evalUtils.validateSamples');
  }, // validateSamples

  /**
   * Makes sure that the args contain all the expected attributes.
   *
   * @param {Object} args - An object containing the required args
   * @returns {Boolean} - true if args ok
   * @throws {ArgsError} - If args missing or incorrect type
   */
  validateTransformArgs: (args) => {
    debug('Entered evalUtils.validateTransformArgs:', args);
    if (!args) {
      throw new errors.ArgsError('Missing args.');
    }

    if (typeof args !== 'object' || Array.isArray(args)) {
      throw new errors.ArgsError('args must be an object.');
    }

    return evalValidation.isObject('ctx', args.ctx) &&
      evalValidation.isObject('res', args.res) &&
      evalValidation.aspects(args.aspects) &&
      evalValidation.validateSubjectArgs(args);
  }, // validateTransformArgs

  /**
   * Makes sure that the args contain all the expected attributes.
   *
   * @param {Object} args - An object containing the required args
   * @returns {Boolean} - true if args ok
   * @throws {ArgsError} - If args missing or incorrect type
   */
  validateToUrlArgs: (args) => {
    debug('Entered evalUtils.validateToUrlArgs:', args);
    if (!args) {
      throw new errors.ArgsError('Missing args.');
    }

    if (typeof args !== 'object' || Array.isArray(args)) {
      throw new errors.ArgsError('args must be an object.');
    }

    return evalValidation.isObject('ctx', args.ctx || {}) &&
      evalValidation.aspects(args.aspects) &&
      evalValidation.subjects(args.subjects);
  }, // validateToUrlArgs

  /**
   * Safely execute the transform or toUrl code from the sample generator
   * template, blocking certain global functions and node functions, and
   * returning the result of the eval. No access to globals.
   *
   * @param {String} functionBody - The body of the function to execute.
   * @param {Object} args - Args to pass through to the function.
   * @param {Boolean} allowLogging - Allow logging from within the transform.
   * @returns {AnyType}
   * @throws {FunctionBodyError} - if functionBody cannot be evaluated
   */
  safeEval: (functionBody, args, allowLogging=false) => {
    debug('safeEval functionBody', functionBody);
    'use strict';
    if (!args) {
      args = {};
    }

    args.eval = undefined; // disable "eval"
    const logLines = { log: [], info: [], error: [], warn: [], };
    args.console = {
      log: (str) => logLines.log.push(str),
      info: (str) => logLines.info.push(str),
      error: (str) => logLines.error.push(str),
      warn: (str) => logLines.warn.push(str),
    };
    try {
      const vm = new VM({
        timeout: EVAL_TIMEOUT_MILLIS,
        sandbox: args,
      });
      const str = `(() => {${functionBody}})()`;
      const ret = vm.run(str);
      handleLogLines(logLines);
      return ret;
    } catch (err) {
      handleLogLines(logLines);
      logger.error('%s running safeEval: %s', err.name, err.message);
      throw new errors.FunctionBodyError(`${err.name}: ${err.message}`);
    }

    function handleLogLines(logLines) {
      if (allowLogging) {
        logLines.log.forEach((str) => console.log(str));
        logLines.info.forEach((str) => console.info(str));
        logLines.error.forEach((str) => console.error(str));
        logLines.warn.forEach((str) => console.warn(str));
      }
    }

  }, // safeEval
};
