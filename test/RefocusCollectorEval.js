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
          done(err);
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
          done(err);
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
          done(err);
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
          done(err);
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
          done(err);
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
          done(err);
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
          done(err);
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
          done(err);
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
          done(err);
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
          done(err);
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
          done(err);
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
          done(err);
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
          done(err);
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
          done(err);
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
          done(err);
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
          done(err);
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
          done(err);
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
          done(err);
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
          done(err);
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

  describe('prepareUrl >', () => {
    it('url is provided', () => {
      const ctx = { host: 'bart.gov.api' };
      const aspects = [{ name: 'Delay', timeout: '1m' }];
      const subjects = [
        { absolutePath: 'Fremont' },
        { absolutePath: 'UnionCity' },
      ];
      const connection = {
        headers: { Authorization: 'abddr121345bb', },
        url: 'http://{{host}}/{{aspects[0].name}}/status/{{subjects[0].absolutePath}}',
        bulk: true,
      };
      const url = rce.prepareUrl(ctx, aspects, subjects, connection);
      expect(url).to.be.equal('http://bart.gov.api/Delay/status/Fremont');
    });

    it('toUrl is provided', () => {
      const ctx = {};
      const aspects = [{ name: 'Delay', timeout: '1m' }];
      const subjects = [
        { absolutePath: 'Fremont' },
        { absolutePath: 'UnionCity' },
      ];
      const connection = {
        headers: { Authorization: 'abddr121345bb', },
        toUrl: 'return "http://bart.gov.api/status";',
        bulk: true,
      };
      const url = rce.prepareUrl(ctx, aspects, subjects, connection);
      expect(url).to.be.equal('http://bart.gov.api/status');
    });

    it('neither url nor toUrl is provided', (done) => {
      const ctx = {};
      const aspects = [{ name: 'Delay', timeout: '1m' }];
      const subjects = [
        { absolutePath: 'Fremont' },
        { absolutePath: 'UnionCity' },
      ];
      const connection = {
        headers: { Authorization: 'abddr121345bb', },
        bulk: true,
      };
      try {
        const url = rce.prepareUrl(ctx, aspects, subjects, connection);
        expect(url).to.be.equal('http://bart.gov.api/status');
        done('Expecting ValidationError');
      } catch (err) {
        expect(err.name).to.be.equal('ValidationError');
        done();
      }
    });
  }); // prepareUrl

  describe('prepareHeaders >', () => {
    it('OK', () => {
      const headers = {
        Accept: 'application/xml',
        Authorization: 'bearer: {{myToken}}',
      };
      const context = {
        myToken: 'abcdef',
      };
      const actual = rce.prepareHeaders(headers, context);
      expect(actual).to.have.property('Accept', 'application/xml');
      expect(actual).to.have.property('Authorization', 'bearer: abcdef');
    });
  }); // prepareHeaders

  describe('validateResponseBody >', () => {
    const schema = JSON.stringify({
      type: 'object',
      properties: {
        body: {
          type: 'object',
          required: ['prop1'],
          properties: {
            prop1: { type: 'string', },
            prop2: { type: 'number', },
          },
        },
      },
    });

    it('valid', () => {
      const res = {
        body: {
          prop1: '...',
        },
      };
      expect(() => rce.validateResponseBody(res, schema)).to.not.throw();
    });

    it('invalid - wrong type', () => {
      const res = {
        body: {
          prop1: '...',
          prop2: '...',
        },
      };
      expect(() => rce.validateResponseBody(res, schema)).to.throw(
        'Response validation failed - /body/prop2 - ' +
        'should be number'
      );
    });

    it('invalid - required prop missing', () => {
      const res = {
        body: {
          prop2: 4,
        },
      };
      expect(() => rce.validateResponseBody(res, schema)).to.throw(
        'Response validation failed - /body - ' +
        "should have required property 'prop1'"
      );
    });

    it('response empty (ok)', () => {
      const res = {};
      expect(() => rce.validateResponseBody(res, schema)).to.not.throw();
    });

    it('response null (error)', () => {
      const res = null;
      expect(() => rce.validateResponseBody(res, schema)).to.throw(
        'Response validation failed - / - should be object'
      );
    });

    it('response not an object (error)', () => {
      const res = '...';
      expect(() => rce.validateResponseBody(res, schema)).to.throw(
        'Response validation failed - res must be an object'
      );
    });

    it('schema empty (ok)', () => {
      const schema = '{}';
      const res = {
        body: {
          prop1: '...',
        },
      };
      expect(() => rce.validateResponseBody(res, schema)).to.not.throw();
    });

    it('schema not a string (error)', () => {
      const schema = {};
      const res = {
        body: {
          prop1: '...',
        },
      };
      expect(() => rce.validateResponseBody(res, schema)).to.throw(
        'Response validation failed - schema must be a string'
      );
    });

    it('schema invalid json', () => {
      const schema = 'aaa';
      const res = {
        body: {
          prop1: '...',
        },
      };
      expect(() => rce.validateResponseBody(res, schema)).to.throw(
        'Response validation failed - schema must be valid JSON'
      );
    });

    it('schema null (error)', () => {
      const schema = {};
      const res = {
        body: {
          prop1: '...',
        },
      };
      expect(() => rce.validateResponseBody(res, schema)).to.throw(
        'Response validation failed - schema must be a string'
      );
    });

  });

  describe('expandObject >', () => {
    it('expand one parameter', (done) => {
      const obj = {
        abc: '{{test}}',
      };
      const ctx = {
        test: 'qwerty',
      };
      const expandedObject = {
        abc: 'qwerty',
      };

      expect(rce.expandObject(obj, ctx)).to.deep.equal(expandedObject);

      done();
    });

    it('expand many parameter', (done) => {
      const obj = {
        abc: '{{test}}',
        abc1: '{{test1}}',
      };
      const ctx = {
        test: 'qwerty',
        test1: 'qwerty1',
      };
      const expandedObject = {
        abc: 'qwerty',
        abc1: 'qwerty1',
      };

      expect(rce.expandObject(obj, ctx)).to.deep.equal(expandedObject);

      done();
    });

    it('expand recursive object', (done) => {
      const obj = {
        abc: '{{test}}',
        abc1: '{{test1}}',
        param1: {
          abc2: '{{test2}}',
        },
      };
      const ctx = {
        test: 'qwerty',
        test1: 'qwerty1',
        test2: 'qwerty2',
      };
      const expandedObject = {
        abc: 'qwerty',
        abc1: 'qwerty1',
        param1: {
          abc2: 'qwerty2',
        },
      };

      expect(rce.expandObject(obj, ctx)).to.deep.equal(expandedObject);

      done();
    });

    it('no need of expand', (done) => {
      const obj = {
        abc: 'test',
        abc1: 'test1',
      };
      const ctx = {
        test: 'qwerty',
        test1: 'qwerty1',
      };
      const expandedObject = {
        abc: 'test',
        abc1: 'test1',
      };

      expect(rce.expandObject(obj, ctx)).to.deep.equal(expandedObject);

      done();
    });

    it('context missing treats as empty', (done) => {
      const obj = {
        abc: '{{test}}',
        abc1: '{{test1}}',
      };
      const ctx = {
        test2: 'qwerty',
        test3: 'qwerty1',
      };
      const expandedObject = {
        abc: '',
        abc1: '',
      };

      expect(rce.expandObject(obj, ctx)).to.deep.equal(expandedObject);

      done();
    });
  });
});
