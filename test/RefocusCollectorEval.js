/**
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * test/RefocusCollectorEval.js
 */
'use strict';
const expect = require('chai').expect;
const rce = require('../src/RefocusCollectorEval');

describe('test/RefocusCollectorEval.js >', (done) => {
  describe('statusCodeMatch >', (done) => {
    const collectRes = {
      name: 'mockGenerator',
      res: {
        statusCode: 200,
      },
      generatorTemplate: {
        transform: {
          transform: 'return [{ name: "S1.S2|A1", value: "10" },' +
          ' { name: "S1.S2|A2", value: "2" }]',
          errorHandlers: {
            404: 'return [{ name: "S1.S2|A1", messageBody: "NOT FOUND" },' +
            ' { name: "S1.S2|A2", messageBody: "NOT FOUND" }]',
            '40[13]': 'return [{ name: "S1.S2|A1", messageBody: ' +
            '"UNAUTHORIZED OR FORBIDDEN" },' +
            ' { name: "S1.S2|A2", messageBody: "UNAUTHORIZED OR FORBIDDEN" }]',
            '5..': 'return [{ name: "S1.S2|A1", messageBody: "SERVER ERROR" },' +
            ' { name: "S1.S2|A2", messageBody: "SERVER ERROR" }]',
          },
        },
      },
    };

    it('error handler match - 404', (done) => {
      try {
        collectRes.res.statusCode = 404;
        const expectedRetVal = collectRes.generatorTemplate.transform
        .errorHandlers['404'];
        const retval = rce.statusCodeMatch(collectRes.generatorTemplate
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
          .errorHandlers['40[13]'];
        const retval = rce.statusCodeMatch(collectRes.generatorTemplate
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
        const retval = rce.statusCodeMatch(collectRes.generatorTemplate
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
          .errorHandlers['5..'];
        const retval = rce.statusCodeMatch(collectRes.generatorTemplate
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
        const retval = rce.statusCodeMatch(collectRes.generatorTemplate
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
        const retval = rce.statusCodeMatch(collectRes.generatorTemplate
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
        const retval = rce.statusCodeMatch(collectRes.generatorTemplate
          .transform, collectRes.res.statusCode);
        expect(retval).to.equal(undefined);
        done();
      } catch (err) {
        done(err);
      }
    });
  }) // statusCodeMatch

  describe('safeTransform >', (done) => {
    const validArgs = {
      ctx: { x: 123, y: 'abc|A2' },
      res: {},
      subjects: [{ absolutePath: 'abc' }],
      aspects: [{ name: 'A1', timeout: '1m' }, { name: 'A2', timeout: '1m' }],
    };

    it('ok, bulk', (done) => {
      try {
        const retval =
          rce.safeTransform('return [{ name: subjects[0].absolutePath + "|A1" },' +
            ' { name: ctx.y }]',
          validArgs);
        expect(retval[0].name).to.equal('abc|A1');
        expect(retval[1].name).to.equal('abc|A2');
        done();
      } catch (err) {
        done(err);
      }
    });

    it('ok, by subject', (done) => {
      validArgs.subject = validArgs.subjects[0];
      delete validArgs.subjects;
      try {
        const retval =
          rce.safeTransform('return [{ name: subject.absolutePath + "|A1" },' +
            ' { name: ctx.y }]',
            validArgs);
        expect(retval[0].name).to.equal('abc|A1');
        expect(retval[1].name).to.equal('abc|A2');
        done();
      } catch (err) {
        done(err);
      }
    });

    it('ok, empty array', (done) => {
      try {
        rce.safeTransform('return []', validArgs);
        done();
      } catch (err) {
        done(err);
      }
    });

    it('returns null instead of array', (done) => {
      try {
        const retval = rce.safeTransform('return null;', validArgs);
        done('Expecting TransformError here');
      } catch (err) {
        if (err.name === 'TransformError') {
          done();
        } else {
          done('Expecting TransformError here');
        }
      }
    });

    it('returns undefined instead of array', (done) => {
      try {
        rce.safeTransform('return;', validArgs);
        done('Expecting TransformError here');
      } catch (err) {
        if (err.name === 'TransformError') {
          done();
        } else {
          done('Expecting TransformError here');
        }
      }
    });

    it('returns object instead of array', (done) => {
      try {
        rce.safeTransform('return { name: "Foo" };', validArgs);
        done('Expecting TransformError here');
      } catch (err) {
        if (err.name === 'TransformError') {
          done();
        } else {
          done('Expecting TransformError here');
        }
      }
    });

    it('returns string instead of array', (done) => {
      try {
        rce.safeTransform('return "Foo";', validArgs);
        done('Expecting TransformError here');
      } catch (err) {
        if (err.name === 'TransformError') {
          done();
        } else {
          done('Expecting TransformError here');
        }
      }
    });

    it('returns number instead of array', (done) => {
      try {
        rce.safeTransform('return 99;', validArgs);
        done('Expecting TransformError here');
      } catch (err) {
        if (err.name === 'TransformError') {
          done();
        } else {
          done('Expecting TransformError here');
        }
      }
    });

    it('returns boolean instead of array', (done) => {
      try {
        rce.safeTransform('return false;', validArgs);
        done('Expecting TransformError here');
      } catch (err) {
        if (err.name === 'TransformError') {
          done();
        } else {
          done('Expecting TransformError here');
        }
      }
    });

    it('returns array with at least one element which is not an object',
    (done) => {
      try {
        rce.safeTransform('return [{ name: "abc|A1" }, 2]', validArgs);
        done('Expecting TransformError here');
      } catch (err) {
        if (err.name === 'TransformError') {
          done();
        } else {
          done('Expecting TransformError here');
        }
      }
    });

    it('returns array with at least one object element which does not have ' +
    'a "name" attribute', (done) => {
      try {
        rce.safeTransform('return [{ value: "Foo" }, { name: "Bar" }]',
          validArgs);
        done('Expecting TransformError here');
      } catch (err) {
        if (err.name === 'TransformError') {
          done();
        } else {
          done('Expecting TransformError here');
        }
      }
    });

    it('invalid if function body is an array', (done) => {
      try {
        rce.safeTransform(['return [{ name: "Foo" }, 2]'], validArgs);
        done('Expecting FunctionBodyError here');
      } catch (err) {
        if (err.name === 'FunctionBodyError') {
          done();
        } else {
          console.log(err);
          done('Expecting FunctionBodyError here');
        }
      }
    });

    it('invalid if function body is an object', (done) => {
      try {
        rce.safeTransform({ a: 'return [{ name: "Foo" }, 2]' }, validArgs);
        done('Expecting FunctionBodyError here');
      } catch (err) {
        if (err.name === 'FunctionBodyError') {
          done();
        } else {
          done('Expecting FunctionBodyError here');
        }
      }
    });

    it('invalid if function body is a number', (done) => {
      try {
        rce.safeTransform(123, validArgs);
        done('Expecting FunctionBodyError here');
      } catch (err) {
        if (err.name === 'FunctionBodyError') {
          done();
        } else {
          done('Expecting FunctionBodyError here');
        }
      }
    });
  }); // safeTransform

  describe('safeToUrl >', (done) => {
    const validArgs = {
      aspects: [{ name: 'A1', timeout: '1m' }],
      ctx: {},
      subjects: [{ absolutePath: 'abc' }],
    };

    it('ok', (done) => {
      try {
        rce.safeToUrl('return "Hello, World"', validArgs);
        done();
      } catch (err) {
        done(err);
      }
    });

    it('ok, empty string', (done) => {
      try {
        rce.safeToUrl('return ""', validArgs);
        done();
      } catch (err) {
        done(err);
      }
    });

    it('returns null instead of string', (done) => {
      try {
        rce.safeToUrl('return null;', validArgs);
        done('Expecting ToUrlError here');
      } catch (err) {
        if (err.name === 'ToUrlError') {
          done();
        } else {
          done('Expecting ToUrlError here');
        }
      }
    });

    it('returns undefined instead of string', (done) => {
      try {
        rce.safeToUrl('return;', validArgs);
        done('Expecting ToUrlError here');
      } catch (err) {
        if (err.name === 'ToUrlError') {
          done();
        } else {
          done('Expecting ToUrlError here');
        }
      }
    });

    it('returns object instead of string', (done) => {
      try {
        rce.safeToUrl('return { name: "Foo" };', validArgs);
        done('Expecting ToUrlError here');
      } catch (err) {
        if (err.name === 'ToUrlError') {
          done();
        } else {
          done('Expecting ToUrlError here');
        }
      }
    });

    it('returns number instead of string', (done) => {
      try {
        rce.safeToUrl('return 99;', validArgs);
        done('Expecting ToUrlError here');
      } catch (err) {
        if (err.name === 'ToUrlError') {
          done();
        } else {
          done('Expecting ToUrlError here');
        }
      }
    });

    it('returns boolean instead of string', (done) => {
      try {
        rce.safeToUrl('return false;', validArgs);
        done('Expecting ToUrlError here');
      } catch (err) {
        if (err.name === 'ToUrlError') {
          done();
        } else {
          done('Expecting ToUrlError here');
        }
      }
    });

    it('invalid if function body is an array', (done) => {
      try {
        rce.safeToUrl(['return false'], validArgs);
        done('Expecting FunctionBodyError here');
      } catch (err) {
        if (err.name === 'FunctionBodyError') {
          done();
        } else {
          console.log(err);
          done('Expecting FunctionBodyError here');
        }
      }
    });

    it('invalid if function body is an object', (done) => {
      try {
        rce.safeToUrl({ a: 'return false;' }, validArgs);
        done('Expecting FunctionBodyError here');
      } catch (err) {
        if (err.name === 'FunctionBodyError') {
          done();
        } else {
          done('Expecting FunctionBodyError here');
        }
      }
    });

    it('invalid if function body is a number', (done) => {
      try {
        rce.safeToUrl(123, validArgs);
        done('Expecting FunctionBodyError here');
      } catch (err) {
        if (err.name === 'FunctionBodyError') {
          done();
        } else {
          done('Expecting FunctionBodyError here');
        }
      }
    });
  }); // safeToUrl

  describe('sampleSchema >', (done) => {
    it('we can access sample schema validation object, valid sample',
    (done) => {
      const joiObj = rce.sampleSchema;
      const val = joiObj.validate({ name: 'root.child|aspName', value: '0' });
      expect(joiObj.isJoi).to.be.equal(true);
      expect(val).to.have.property('error', null);
      done();
    });

    it('we can access sample schema validation object, invalid sample',
    (done) => {
      const joiObj = rce.sampleSchema;
      const val = joiObj.validate({ notName: 'root.child|aspName' });
      expect(joiObj.isJoi).to.be.equal(true);
      expect(val).to.have.property('error')
      .to.have.property('name', 'ValidationError');
      done();
    });
  });
});
