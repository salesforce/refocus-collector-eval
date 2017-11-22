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

Returns a transform function based on the status code provided. Checks for a status match in transform.errorHandlers (including any "override" for any 2xx status the template may define). If there is an errorHandler defined for the status code, returns the first match (transform.errorHandler keys sorted alphabetically). If there is no errorHandler defined for the status code provided, if the status code is 2xx, returns transform.default. If there is no errorHandler AND the status code is NOT 2xx, returns false.

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