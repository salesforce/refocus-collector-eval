/**
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * test/getTransformFunction.js
 */
'use strict';
const expect = require('chai').expect;
const getTransformFunction = require('../src/RefocusCollectorEval')
  .getTransformFunction;

describe('test/getTransformFunction.js >', (done) => {
  const collectRes = {
    name: 'mockGenerator',
    res: {
      statusCode: 200,
    },
    generatorTemplate: {
      transform: {
        default: 'return [{ name: "S1.S2|A1", value: "10" },' +
          ' { name: "S1.S2|A2", value: "2" }]',
        errorHandlers: {
          '40[13]': 'return [{ name: "S1.S2|A1", messageBody: ' +
            '"UNAUTHORIZED OR FORBIDDEN" },' +
            ' { name: "S1.S2|A2", messageBody: "UNAUTHORIZED OR FORBIDDEN" }]',
          404: 'return [{ name: "S1.S2|A1", messageBody: "404" },' +
            ' { name: "S1.S2|A2", messageBody: "404" }]',
          401: 'return [{ name: "S1.S2|A1", messageBody: "401" },' +
            ' { name: "S1.S2|A2", messageBody: "401" }]',
          '5..': 'return [{ name: "S1.S2|A1", messageBody: "SERVER ERROR" },' +
            ' { name: "S1.S2|A2", messageBody: "SERVER ERROR" }]',
          500: 'return [{ name: "S1.S2|A1", messageBody: "SERVER 500 ERROR" },' +
            ' { name: "S1.S2|A2", messageBody: "SERVER 500 ERROR" }]',
        },
      },
    },
  };

  it('2xx', (done) => {
    try {
      collectRes.res.statusCode = 200;
      const expectedRetVal = collectRes.generatorTemplate.transform
        .default;
      const retval = getTransformFunction(collectRes.generatorTemplate
        .transform, collectRes.res.statusCode);
      expect(retval).to.equal(expectedRetVal);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('error handler match - 404', (done) => {
    try {
      collectRes.res.statusCode = 404;
      const expectedRetVal = collectRes.generatorTemplate.transform
        .errorHandlers['404'];
      const retval = getTransformFunction(collectRes.generatorTemplate
        .transform, collectRes.res.statusCode);
      expect(retval).to.equal(expectedRetVal);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('error handler match - 401', (done) => {
    try {
      collectRes.res.statusCode = 401;
      const expectedRetVal = collectRes.generatorTemplate.transform
        .errorHandlers['401'];
      const retval = getTransformFunction(collectRes.generatorTemplate
        .transform, collectRes.res.statusCode);
      expect(retval).to.equal(expectedRetVal);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('error handler match - 403', (done) => {
    try {
      collectRes.res.statusCode = 403;
      const expectedRetVal = collectRes.generatorTemplate.transform
        .errorHandlers['40[13]'];
      const retval = getTransformFunction(collectRes.generatorTemplate
        .transform, collectRes.res.statusCode);
      expect(retval).to.equal(expectedRetVal);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('error handler match - 500', (done) => {
    try {
      collectRes.res.statusCode = 500;
      const expectedRetVal = collectRes.generatorTemplate.transform
        .errorHandlers['500'];
      const retval = getTransformFunction(collectRes.generatorTemplate
        .transform, collectRes.res.statusCode);
      expect(retval).to.equal(expectedRetVal);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('error handler match - 503', (done) => {
    try {
      collectRes.res.statusCode = 503;
      const expectedRetVal = collectRes.generatorTemplate.transform
        .errorHandlers['5..'];
      const retval = getTransformFunction(collectRes.generatorTemplate
        .transform, collectRes.res.statusCode);
      expect(retval).to.equal(expectedRetVal);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('error handler match - override 200', (done) => {
    try {
      collectRes.res.statusCode = 200;
      collectRes.generatorTemplate.transform.errorHandlers['200'] =
        'return [{ name: "S1.S2|A1", messageBody: "OK" },'
        + ' { name: "S1.S2|A2", messageBody: "OK" }]';
      const expectedRetVal = collectRes.generatorTemplate.transform
        .errorHandlers['200'];
      const retval = getTransformFunction(collectRes.generatorTemplate
        .transform, collectRes.res.statusCode);
      expect(retval).to.equal(expectedRetVal);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('error handler no match', (done) => {
    try {
      collectRes.res.statusCode = 429;
      const retval = getTransformFunction(collectRes.generatorTemplate
        .transform, collectRes.res.statusCode);
      expect(retval).to.equal(false);
      done();
    } catch (err) {
      done(err);
    }
  });
});
