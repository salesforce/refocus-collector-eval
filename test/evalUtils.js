/**
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * test/evalUtils.js
 */
'use strict';
const expect = require('chai').expect;
const eu = require('../src/evalUtils');
const sinon = require('sinon');

describe('test/utils/evalUtils.js >', (done) => {
  describe('validateTransformArgs >', (done) => {
    it('object with required set of attributes, bulk', (done) => {
      try {
        eu.validateTransformArgs({
          aspects: [{ name: 'A', timeout: '1m' }],
          ctx: {},
          res: {},
          subjects: [{ absolutePath: 'abc' }],
        });
        done();
      } catch (err) {
        done(err);
      }
    });

    it('object with required set of attributes, by subject', (done) => {
      try {
        eu.validateTransformArgs({
          aspects: [{ name: 'A', timeout: '1m' }],
          ctx: {},
          res: {},
          subject: { absolutePath: 'abc' },
        });
        done();
      } catch (err) {
        done(err);
      }
    });

    it('object with no attributes', (done) => {
      try {
        eu.validateTransformArgs({});
        done(new Error('Expecting ArgsError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ArgsError');
        done();
      }
    });

    it('object with missing or inorrect attributes', (done) => {
      try {
        eu.validateTransformArgs({ ctx: {} });
        done(new Error('Expecting ArgsError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ArgsError');
        done();
      }
    });

    it('empty', (done) => {
      try {
        eu.validateTransformArgs();
        done(new Error('Expecting ArgsError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ArgsError');
        done();
      }
    });

    it('undefined', (done) => {
      try {
        eu.validateTransformArgs(undefined);
        done(new Error('Expecting ArgsError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ArgsError');
        done();
      }
    });

    it('null', (done) => {
      try {
        eu.validateTransformArgs(null);
        done(new Error('Expecting ArgsError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ArgsError');
        done();
      }
    });

    it('number', (done) => {
      try {
        eu.validateTransformArgs(123);
        done(new Error('Expecting ArgsError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ArgsError');
        done();
      }
    });

    it('array', (done) => {
      try {
        eu.validateTransformArgs([1, 2, 3]);
        done(new Error('Expecting ArgsError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ArgsError');
        done();
      }
    });

    it('string', (done) => {
      try {
        eu.validateTransformArgs('abc defgh');
        done(new Error('Expecting ArgsError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ArgsError');
        done();
      }
    });

    it('boolean true', (done) => {
      try {
        eu.validateTransformArgs(true);
        done(new Error('Expecting ArgsError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ArgsError');
        done();
      }
    });

    it('boolean false', (done) => {
      try {
        eu.validateTransformArgs(false);
        done(new Error('Expecting ArgsError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ArgsError');
        done();
      }
    });
  }); // validateTransformArgs

  describe('validateToUrlArgs >', (done) => {
    it('object with required set of attributes', (done) => {
      try {
        eu.validateToUrlArgs({
          ctx: {},
          aspects: [{ name: 'A', timeout: '1m' }],
          subjects: [{ absolutePath: 'abc' }],
        });
        done();
      } catch (err) {
        done(err);
      }
    });

    it('object with no attributes', (done) => {
      try {
        eu.validateToUrlArgs({});
        done(new Error('Expecting ArgsError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ArgsError');
        done();
      }
    });

    it('object with missing or inorrect attributes', (done) => {
      try {
        eu.validateToUrlArgs({ ctx: {} });
        done(new Error('Expecting ArgsError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ArgsError');
        done();
      }
    });

    it('empty', (done) => {
      try {
        eu.validateToUrlArgs();
        done(new Error('Expecting ArgsError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ArgsError');
        done();
      }
    });

    it('undefined', (done) => {
      try {
        eu.validateToUrlArgs(undefined);
        done(new Error('Expecting ArgsError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ArgsError');
        done();
      }
    });

    it('null', (done) => {
      try {
        eu.validateToUrlArgs(null);
        done(new Error('Expecting ArgsError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ArgsError');
        done();
      }
    });

    it('number', (done) => {
      try {
        eu.validateToUrlArgs(123);
        done(new Error('Expecting ArgsError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ArgsError');
        done();
      }
    });

    it('array', (done) => {
      try {
        eu.validateToUrlArgs([1, 2, 3]);
        done(new Error('Expecting ArgsError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ArgsError');
        done();
      }
    });

    it('string', (done) => {
      try {
        eu.validateToUrlArgs('abc defgh');
        done(new Error('Expecting ArgsError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ArgsError');
        done();
      }
    });

    it('boolean true', (done) => {
      try {
        eu.validateToUrlArgs(true);
        done(new Error('Expecting ArgsError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ArgsError');
        done();
      }
    });

    it('boolean false', (done) => {
      try {
        eu.validateToUrlArgs(false);
        done(new Error('Expecting ArgsError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ArgsError');
        done();
      }
    });
  }); // validateToUrlArgs

  describe('safeEval >', (done) => {
    it('ok', (done) => {
      const ctx = {
        abc: 'abcdefghijklmnop',
        n: -5,
      };
      const str = `
        return [abc, n, abc.slice(n)];
      `;
      const res = eu.safeEval(str, ctx);
      expect(res).to.be.an('array');
      expect(res).to.have.length(3);
      expect(res[0]).to.equal(ctx.abc);
      expect(res[1]).to.equal(ctx.n);
      expect(res[2]).to.equal(ctx.abc.slice(ctx.n));
      done();
    });

    it('no require', (done) => {
      const ctx = {
        abc: 'abcdefghijklmnop',
        n: -5,
      };
      const str = `
        const fs = require('fs');
        const arr = fs.readdirSync('../');
        return arr;
      `;
      try {
        eu.safeEval(str, ctx);
        done(new Error('Expecting FunctionBodyError'));
      } catch (err) {
        expect(err).to.have.property('name', 'FunctionBodyError');
        done();
      }
    });

    it('no module.require', (done) => {
      const ctx = {
        abc: 'abcdefghijklmnop',
        n: -5,
      };
      const str = `
        const fs = module.require('fs');
        const arr = fs.readdirSync('../');
        return arr;
      `;
      try {
        eu.safeEval(str, ctx);
        done(new Error('Expecting FunctionBodyError here'));
      } catch (err) {
        if (err.name === 'FunctionBodyError') {
          done();
        } else {
          done(new Error('Expecting FunctionBodyError here'));
        }
      }
    });

    it('no module.exports', (done) => {
      const str = `return module.exports`;
      try {
        eu.safeEval(str);
        done(new Error('Expecting FunctionBodyError here'));
      } catch (err) {
        if (err.name === 'FunctionBodyError') {
          done();
        } else {
          done(new Error('Expecting FunctionBodyError here'));
        }
      }
    });

    it('no exports', (done) => {
      const str = `return exports`;
      try {
        eu.safeEval(str);
        done(new Error('Expecting FunctionBodyError here'));
      } catch (err) {
        if (err.name === 'FunctionBodyError') {
          done();
        } else {
          done(new Error('Expecting FunctionBodyError here'));
        }
      }
    });

    it('no eval', (done) => {
      const str = `eval('3+3')`;
      try {
        eu.safeEval(str);
        done(new Error('Expecting FunctionBodyError'));
      } catch (err) {
        expect(err).to.have.property('name', 'FunctionBodyError');
        done();
      }
    });

    it('no access to "process"', (done) => {
      const str = `return process.env`;
      try {
        eu.safeEval(str);
        done(new Error('Expecting FunctionBodyError here'));
      } catch (err) {
        if (err.name === 'FunctionBodyError') {
          done();
        } else {
          done(new Error('Expecting FunctionBodyError here'));
        }
      }
    });

    it('no setTimeout', (done) => {
      const str = `return setTimeout(() => 'Hi!', 1);`;
      try {
        eu.safeEval(str);
        done(new Error('Expecting FunctionBodyError here'));
      } catch (err) {
        if (err.name === 'FunctionBodyError') {
          done();
        } else {
          done(new Error('Expecting FunctionBodyError here'));
        }
      }
    });

    it('no setInterval', (done) => {
      const str = `return setInterval(() => 'Hi!', 1);`;
      try {
        eu.safeEval(str);
        done(new Error('Expecting FunctionBodyError here'));
      } catch (err) {
        if (err.name === 'FunctionBodyError') {
          done();
        } else {
          done(new Error('Expecting FunctionBodyError here'));
        }
      }
    });

    it('no __dirname', (done) => {
      const str = `return __dirname`;
      try {
        eu.safeEval(str);
        done(new Error('Expecting FunctionBodyError here'));
      } catch (err) {
        if (err.name === 'FunctionBodyError') {
          done();
        } else {
          done(new Error('Expecting FunctionBodyError here'));
        }
      }
    });

    it('no __filename', (done) => {
      const str = `return __filename`;
      try {
        eu.safeEval(str);
        done(new Error('Expecting FunctionBodyError here'));
      } catch (err) {
        if (err.name === 'FunctionBodyError') {
          done();
        } else {
          done(new Error('Expecting FunctionBodyError here'));
        }
      }
    });

    it('RegExp ok', (done) => {
      const str = `var myRe = /d(b+)d/g; ` +
        `return myRe.exec('cdbbdbsbz');`;
      try {
        const retval = eu.safeEval(str);
        expect(retval[0]).to.equal('dbbd');
        expect(retval[1]).to.equal('bb');
        done();
      } catch (err) {
        done(err);
      }
    });

    it('JSON.parse ok', (done) => {
      const str = `return JSON.parse('{ "a": 100 }');`;
      try {
        const retval = eu.safeEval(str);
        expect(retval).to.have.property('a', 100);
        done();
      } catch (err) {
        done(err);
      }
    });

    it('JSON.stringify ok', (done) => {
      const str = `return JSON.stringify({ a: 100 });`;
      try {
        const retval = eu.safeEval(str);
        expect(retval).to.equal('{"a":100}');
        done();
      } catch (err) {
        done(err);
      }
    });

    it('Math ok', (done) => {
      const str = `return Math.ceil(9.56);`;
      try {
        const retval = eu.safeEval(str);
        expect(retval).to.equal(10);
        done();
      } catch (err) {
        done(err);
      }
    });

    it('try catch ok - return from try', (done) => {
      const str = 'try { return 10; } ' +
        'catch (err) { return -10; } ' +
        'return 0; ';
      try {
        const retval = eu.safeEval(str);
        expect(retval).to.equal(10);
        done();
      } catch (err) {
        done(err);
      }
    });

    it('try catch ok - return from catch', (done) => {
      const str = 'try { throw new Error("uh oh"); } ' +
        'catch (err) { return -10; } ' +
        'return 0; ';
      try {
        const retval = eu.safeEval(str);
        expect(retval).to.equal(-10);
        done();
      } catch (err) {
        done(err);
      }
    });

    it('try catch ok - throws', (done) => {
      const str = 'try { throw new Error("uh oh"); } ' +
        'catch (err) { throw err; } ' +
        'return 0; ';
      try {
        eu.safeEval(str);
        done(new Error('Expecting error'));
      } catch (err) {
        expect(err.name).to.equal('FunctionBodyError');
        done();
      }
    });

    it('String.length ok', (done) => {
      const str = `return 'abcde'.length;`;
      try {
        const retval = eu.safeEval(str);
        expect(retval).to.equal(5);
        done();
      } catch (err) {
        done(err);
      }
    });

    it('define function inside ok', (done) => {
      const str = 'function double(n) { return n*2; } ' +
        'return double(10);';
      try {
        const retval = eu.safeEval(str);
        expect(retval).to.equal(20);
        done();
      } catch (err) {
        done(err);
      }
    });

    it('define fat arrow function inside ok', (done) => {
      const str = 'const double = (n) => n*2; ' +
        'return double(10);';
      try {
        const retval = eu.safeEval(str);
        expect(retval).to.equal(20);
        done();
      } catch (err) {
        done(err);
      }
    });

    it('timeout', (done) => {
      const str = 'let i = 0; while (true) { i++ } return i;';
      try {
        const retval = eu.safeEval(str);
        done(new Error('Expecting "Script execution timed out."'));
      } catch (err) {
        expect(err).to.have.property('name', 'FunctionBodyError');
        expect(err.message).to.contain('Script execution timed out.');
        done();
      }
    });

    describe('logging >', () => {
      const methods = ['log', 'info', 'error', 'warn'];
      let spies = {};

      before(() => {
        methods.forEach((key) => spies[key] = sinon.spy(console, key));
      });

      afterEach(() => {
        methods.forEach((key) => spies[key].reset());
      });

      after(() => {
        methods.forEach((key) => spies[key].restore());
      });

      it('logging not allowed by default', (done) => {
        const str = `console.log('1');console.info('2');console.error('3');` +
          `console.warn('4')`;
        try {
          eu.safeEval(str);
          expect(spies.log.called).to.be.false;
          expect(spies.info.called).to.be.false;
          expect(spies.error.called).to.be.false;
          expect(spies.warn.called).to.be.false;
          done();
        } catch (err) {
          done(err);
        }
      });

      it('logging ok with flag', (done) => {
        const str = `console.log('1');console.info('2');console.error('3');` +
          `console.warn('4');console.log('1');console.info('2');` +
          `console.error('3');console.warn('4');`;
        try {
          eu.safeEval(str, {}, true);
          expect(spies.log.callCount).to.equal(2);
          expect(spies.info.callCount).to.equal(2);
          expect(spies.error.callCount).to.equal(2);
          expect(spies.warn.callCount).to.equal(2);
          expect(spies.log.calledWith('1')).to.be.true;
          expect(spies.info.calledWith('2')).to.be.true;
          expect(spies.error.calledWith('3')).to.be.true;
          expect(spies.warn.calledWith('4')).to.be.true;
          done();
        } catch (err) {
          done(err);
        }
      });

      it('logging ok even if error', (done) => {
        const str = `console.log('1');console.info('2');console.error('3');` +
          `console.warn('4');aaa.bbb();console.log('1');console.info('2');` +
          `console.error('3');console.warn('4');`;
        try {
          eu.safeEval(str, {}, true);
          done(new Error('Expecting FunctionBodyError here'));
        } catch (err) {
          if (err.name === 'FunctionBodyError') {
            expect(spies.log.callCount).to.equal(1);
            expect(spies.info.callCount).to.equal(1);
            expect(spies.error.callCount).to.equal(1);
            expect(spies.warn.callCount).to.equal(1);
            expect(spies.log.calledWith('1')).to.be.true;
            expect(spies.info.calledWith('2')).to.be.true;
            expect(spies.error.calledWith('3')).to.be.true;
            expect(spies.warn.calledWith('4')).to.be.true;
            done();
          } else {
            done(new Error('Expecting FunctionBodyError here'));
          }
        }
      });

    });
  }); // safeEval

  describe('validateSamples >', () => {
    it('Samples returned not array', (done) => {
      const sampleArr = { name: 'S1|A1', value: 10 };
      const gen = {
        name: 'mockGenerator',
        subjects: [{ absolutePath: 'S1' }, { absolutePath: 'S2' }],
        aspects: [{ name: 'A1', timeout: '1m' }, { name: 'A2', timeout: '1m' }],
      };
      try {
        eu.validateSamples(sampleArr, gen);
        done(new Error('Expecting TransformError'));
      } catch (err) {
        expect(err.message)
        .to.be.equal('The transform function must return an array.');
        done();
      }
    });

    it('Sample is not an object', (done) => {
      const sampleArr = ['abcd', 'efgh'];
      const gen = {
        name: 'mockGenerator',
        subjects: [{ absolutePath: 'S1' }, { absolutePath: 'S2' }],
        aspects: [{ name: 'A1', timeout: '1m' }, { name: 'A2', timeout: '1m' }],
      };
      try {
        eu.validateSamples(sampleArr, gen);
        done(new Error('Expecting TransformError'));
      } catch (err) {
        expect(err).to.have.property('name', 'TransformError');
        done();
      }
    });

    it('Sample does not have name', (done) => {
      const sampleArr = [{ abc: 'S1|A1', value: '10' }];
      const gen = {
        name: 'mockGenerator',
        subjects: [{ absolutePath: 'S1' }, { absolutePath: 'S2' }],
        aspects: [{ name: 'A1', timeout: '1m' }, { name: 'A2', timeout: '1m' }],
      };
      try {
        eu.validateSamples(sampleArr, gen);
        done(new Error('Expecting TransformError'));
      } catch (err) {
        expect(err).to.have.property('name', 'TransformError');
        done();
      }
    });

    it('Sample name is not string', (done) => {
      const sampleArr = [{ name: 2, value: 10 }];
      const gen = {
        name: 'mockGenerator',
        subjects: [{ absolutePath: 'S1' }, { absolutePath: 'S2' }],
        aspects: [{ name: 'A1', timeout: '1m' }, { name: 'A2', timeout: '1m' }],
      };
      try {
        eu.validateSamples(sampleArr, gen);
        done(new Error('Expecting TransformError'));
      } catch (err) {
        expect(err).to.have.property('name', 'TransformError');
        done();
      }
    });

    it('More samples than expected, bulk', (done) => {
      const sampleArr = [
        { name: 'S1|A1', value: 10 }, { name: 'S1|A2', value: 2 },
        { name: 'S2|A1', value: 10 }, { name: 'S2|A2', value: 2 },
        { name: 'S2|A1', value: 10 }, { name: 'S2|A2', value: 2 },
      ];
      const gen = {
        name: 'mockGenerator',
        subjects: [{ absolutePath: 'S1' }, { absolutePath: 'S2' }],
        aspects: [{ name: 'A1', timeout: '1m' }, { name: 'A2', timeout: '1m' }],
      };
      try {
        eu.validateSamples(sampleArr, gen);
        done(new Error('Expecting ValidationError'));
      } catch (err) {
        expect(err.message).to.be.equal('Number of samples more than expected.' +
          ' Samples count: 6, Subjects count: 2, Aspects count: 2');
        done();
      }
    });

    it('More samples than expected, by subject', (done) => {
      const sampleArr = [
        { name: 'S1|A1', value: 10 }, { name: 'S1|A2', value: 2 },
        { name: 'S2|A1', value: 10 },
      ];
      const gen = {
        name: 'mockGenerator',
        subject: { absolutePath: 'S1' },
        aspects: [{ name: 'A1', timeout: '1m' }, { name: 'A2', timeout: '1m' }],
      };
      try {
        eu.validateSamples(sampleArr, gen);
        done(new Error('Expecting ValidationError'));
      } catch (err) {
        expect(err.message).to.be.equal('Number of samples more than expected.' +
          ' Samples count: 3, Subjects count: 1, Aspects count: 2');
        done();
      }
    });

    it('Unknown aspect in samples', (done) => {
      const sampleArr = [
        { name: 'S1|A1', value: '10' }, { name: 'S1|A2', value: '2' },
        { name: 'S2|A1', value: '10' }, { name: 'S2|A3', value: '2' },
      ];
      const gen = {
        name: 'mockGenerator',
        subjects: [{ absolutePath: 'S1' }, { absolutePath: 'S2' }],
        aspects: [{ name: 'A1', timeout: '1m' }, { name: 'A2', timeout: '1m' }],
      };
      try {
        eu.validateSamples(sampleArr, gen);
        done(new Error('Expecting ValidationError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ValidationError');
        done();
      }
    });

    it('Unknown subject in samples, bulk', (done) => {
      const sampleArr = [
        { name: 'S1|A1', value: '10' }, { name: 'S1|A2', value: '2' },
        { name: 'S2|A1', value: '10' }, { name: 'S3|A2', value: '2' },
      ];
      const gen = {
        name: 'mockGenerator',
        subjects: [{ absolutePath: 'S1' }, { absolutePath: 'S2' }],
        aspects: [{ name: 'A1', timeout: '1m' }, { name: 'A2', timeout: '1m' }],
      };
      try {
        eu.validateSamples(sampleArr, gen);
        done(new Error('Expecting ValidationError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ValidationError');
        done();
      }
    });

    it('Unknown subject in samples, by subject', (done) => {
      const sampleArr = [
        { name: 'S1|A1', value: '10' }, { name: 'S1|A2', value: '2' },
        { name: 'S2|A1', value: '10' },
      ];
      const gen = {
        name: 'mockGenerator',
        subject: { absolutePath: 'S1' },
        aspects: [{ name: 'A1', timeout: '1m' }, { name: 'A2', timeout: '1m' }],
      };
      try {
        eu.validateSamples(sampleArr, gen);
        done(new Error('Expecting ValidationError'));
      } catch (err) {
        expect(err).to.have.property('name', 'ValidationError');
        done();
      }
    });

    it('Duplicate samples in sample array', (done) => {
      const sampleArr = [
        { name: 'S1|A1', value: '10' }, { name: 'S1|A2', value: '2' },
        { name: 'S2|A1', value: '10' }, { name: 'S1|A2', value: '2' },
      ];
      const gen = {
        name: 'mockGenerator',
        subjects: [{ absolutePath: 'S1' }, { absolutePath: 'S2' }],
        aspects: [{ name: 'A1', timeout: '1m' }, { name: 'A2', timeout: '1m' }],
      };
      try {
        eu.validateSamples(sampleArr, gen);
        done(new Error('Expecting ValidationError'));
      } catch (err) {
        expect(err.message).to.be.equal('Duplicate sample found: s1|a2');
        done();
      }
    });

    it('Invalid sample name without |', (done) => {
      const sampleArr = [
        { name: 'S1|A1', value: '10' }, { name: 'S1|A2', value: '2' },
        { name: 'S2|A1', value: '10' }, { name: 'S1A2', value: '2' },
      ];
      const gen = {
        name: 'mockGenerator',
        subjects: [{ absolutePath: 'S1' }, { absolutePath: 'S2' }],
        aspects: [{ name: 'A1', timeout: '1m' }, { name: 'A2', timeout: '1m' }],
      };
      try {
        eu.validateSamples(sampleArr, gen);
        done(new Error('Expecting TransformError'));
      } catch (err) {
        expect(err).to.have.property('name', 'TransformError');
        done();
      }
    });

    it('OK, bulk', (done) => {
      const sampleArr = [
        { name: 'S1|A1', value: '10' }, { name: 'S1|A2', value: '2' },
        { name: 'S2|A1', value: '10' }, { name: 'S2|A2', value: '2' },
      ];
      const gen = {
        name: 'mockGenerator',
        subjects: [{ absolutePath: 'S1' }, { absolutePath: 'S2' }],
        aspects: [{ name: 'A1', timeout: '1m' }, { name: 'A2', timeout: '1m' }],
      };
      try {
        eu.validateSamples(sampleArr, gen);
        done();
      } catch (err) {
        done(err);
      }
    });

    it('OK, by subject', (done) => {
      const sampleArr = [
        { name: 'S1|A1', value: '10' }, { name: 'S1|A2', value: '2' },
      ];
      const gen = {
        name: 'mockGenerator',
        subject: { absolutePath: 'S1' },
        aspects: [{ name: 'A1', timeout: '1m' }, { name: 'A2', timeout: '1m' }],
      };
      try {
        eu.validateSamples(sampleArr, gen);
        done();
      } catch (err) {
        done(err);
      }
    });
  }); // validateSamples
});
