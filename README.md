# Refocus Collector Eval

Collector eval utils used by Refocus Collector System to validate transform and toUrl functions

## Install

`npm install @salesforce/refocus-collector-eval --save`

## Functions available to import
### safeTransform function
Safely executes the given transform function with the arguments provided. Returns array of zero or more samples.

### safeToUrl
Safely executes the given toUrl function with the arguments provided. Returns the generated url as a string.

### statusCodeMatch
Check for a status code regex match which maps to a transform for error samples.
Returns the matched function.

## Usage
  ```
  const RefocusCollectorEval = require('@salesforce/refocus-collector-eval');

  const sampleArr = RefocusCollectorEval.safeTransform(transformFunc, args);
  const url = RefocusCollectorEval.safeToUrl(toUrlFunc, args);
  const func = RefocusCollectorEval.statusCodeMatch(transform, status);
  ```

## Projects using this module
[Refocus-Collector](https://github.com/salesforce/refocus-collector)
