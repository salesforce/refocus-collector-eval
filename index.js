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
    debug('Entered evalUtils.safeTransform');
    if (typeof functionBody !== 'string') {
      const msg = 'Transform function body must be a string';
      throw new errors.FunctionBodyError(msg);
    }

    validateTransformArgs(args);
    args.SAMPLE_BODY_MAX_LEN = SAMPLE_BODY_MAX_LEN;
    const retval = safeEval(functionBody, args);
    validateSamples(retval, args);
    debug('evalUtils.safeTransform returning %d samples: %j', retval.length,
      retval);
    return retval;
  }

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

    validateToUrlArgs(args);
    const retval = safeEval(functionBody, args);
    if (typeof retval !== 'string') {
      throw new errors.ToUrlError(ERROR_MESSAGE.TO_URL.NOT_STRING);
    }

    debug('evalUtils.safeToUrl returning: ${retval}');
    return retval;
  }
}

module.exports = RefocusCollectorEval;
