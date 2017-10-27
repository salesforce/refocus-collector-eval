/**
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * test/schema.js
 */
const expect = require('chai').expect;
const schema = require('../src/schema');

describe('test/schema.js >', () => {
  describe('sample >', () => {
    const v = schema.sample;

    it('ok', (done) => {
      const sample = { name: 'sample1|aspName', value: '0' };
      expect(v.validate(sample)).to.have.property('error', null);
      done();
    });

    it('ok with .', (done) => {
      const sample = { name: 'root.child|aspName', value: '0' };
      expect(v.validate(sample)).to.have.property('error', null);
      done();
    });

    it('sample not object', (done) => {
      const sample = 'abc';
      const val = schema.sample.validate(sample);
      expect(val).to.have.property('error')
      .to.have.property('name', 'ValidationError');
      done();
    });

    it('sample an array', (done) => {
      const sample = ['abc'];
      const val = schema.sample.validate(sample);
      expect(val).to.have.property('error')
      .to.have.property('name', 'ValidationError');
      done();
    });

    it('sample does not have name property', (done) => {
      const sample = { abc: 'sample1|aspName' };
      const val = schema.sample.validate(sample);
      expect(val).to.have.property('error')
      .to.have.property('name', 'ValidationError');
      done();
    });

    it('sample name too small', (done) => {
      const sample = { name: 's|' };
      const val = schema.sample.validate(sample);
      expect(val).to.have.property('error')
      .to.have.property('name', 'ValidationError');
      done();
    });

    it('sample name no |', (done) => {
      const sample = { name: 'sn' };
      const val = schema.sample.validate(sample);
      expect(val).to.have.property('error')
      .to.have.property('name', 'ValidationError');
      done();
    });
  }); // sample
});
