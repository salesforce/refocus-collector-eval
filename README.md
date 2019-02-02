[![Coverage Status](https://coveralls.io/repos/github/salesforce/refocus-collector-eval/badge.svg)](https://coveralls.io/github/salesforce/refocus-collector-eval)

# Refocus Collector Eval

Collector eval utils used by Refocus Collector System to validate transform and toUrl functions

## Install

`npm install @salesforce/refocus-collector-eval --save`

## API

### RefocusCollectorEval.safeTransform(transformFunc, args)

Safely executes the given transform function with the arguments provided. Returns array of zero or more samples.

### RefocusCollectorEval.safeToUrl(toUrlFunc, args)

Safely executes the given toUrl function with the arguments provided. Returns the generated url as a string.

### RefocusCollectorEval.getTransformFunction(transform, status)

Returns a transform function based on the status code provided. Checks for an exact status match from transform.errorHandlers. If there is an exact match, returns that one. If no exact match is found, checks for a regex status match. If there is an errorHandler defined for the status code based on a regex match, returns the first regex match found. If there is no errorHandler defined for the status code provided, if the status code is 2xx, returns transform.default. If there is no errorHandler AND the status code is NOT 2xx, returns false.

### RefocusCollectorEval.sampleSchema

Returns the Joi schema for sample validation.

## Usage

```
const RefocusCollectorEval = require('@salesforce/refocus-collector-eval');

const sampleArr = RefocusCollectorEval.safeTransform(transformFunc, args);
const url = RefocusCollectorEval.safeToUrl(toUrlFunc, args);
const func = RefocusCollectorEval.getTransformFunction(transform, status);
const sampleSchema = RefocusCollectorEval.sampleSchema;
```

## Projects using this module

- [Refocus Collector](https://github.com/salesforce/refocus-collector)
- [Refocus Sample Generator Template Utils](https://github.com/salesforce/refocus-sample-generator-template-utils)

# Version History
- 1.11.2: Hide secrets from debug output
- 1.11.1: Expand object bug fix.
- 1.11.0: Removed unnecessary logging.
- 1.10.0: Add new expandObject function to apply variable expansion across multiple attributes of an object instead of just for a single stering.
- 1.9.0: Add aspects and subjects to context for url variable substitution; support object and array references in template expansion.
