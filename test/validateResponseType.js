/**
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * test/validateResponseType.js
 */
'use strict';
const expect = require('chai').expect;
const validateResponseType = require('../src/RefocusCollectorEval')
  .validateResponseType;

describe('test/validateResponseType.js >', (done) => {
  const responseHeaders = {
    'content-type': 'text/html',
    foo: 'bar',
  };

  it('SGT does not specify any headers, no res content type', (done) => {
    try {
      const actual = validateResponseType(undefined, { foo: 'bar' });
      expect(actual).to.equal(true);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('SGT does not specify any headers, res has content type', (done) => {
    try {
      const actual = validateResponseType(undefined, responseHeaders);
      expect(actual).to.equal(true);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('SGT does not specify Accept header, no res content type', (done) => {
    const h = {
      foo: 'bar',
    };
    try {
      const actual = validateResponseType(h, { foo: 'bar' });
      expect(actual).to.equal(true);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('SGT does not specify Accept header, res has content type', (done) => {
    const h = {
      foo: 'bar',
    };
    try {
      const actual = validateResponseType(h, responseHeaders);
      expect(actual).to.equal(true);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('SGT specifies Accept header with single value, no res content type',
  (done) => {
    const h = {
      Accept: 'text/html',
      foo: 'bar',
    };
    try {
      const actual = validateResponseType(h, { foo: 'bar' });
      expect(actual).to.equal(true);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('SGT specifies Accept header with single value, matches res content type',
  (done) => {
    const h = {
      Accept: 'text/html',
      foo: 'bar',
    };
    try {
      const actual = validateResponseType(h, responseHeaders);
      expect(actual).to.equal(true);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('SGT specifies Accept header with single value, does not match res ' +
  'content type', (done) => {
    const h = {
      Accept: 'application/json',
      foo: 'bar',
    };
    try {
      validateResponseType(h, responseHeaders);
      done(new Error('expecting error due to mismatch'));
    } catch (err) {
      expect(err).to.have.property('message',
        'Accept application/json but got text/html');
      done();
    }
  });

  it('SGT specifies an Accept header with multiple values, no res content type',
  (done) => {
    const h = {
      Accept: 'text/html, text/xml',
      foo: 'bar',
    };
    try {
      const actual = validateResponseType(h, { foo: 'bar' });
      expect(actual).to.equal(true);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('SGT specifies an Accept header with multiple values, no res content ' +
  'type match', (done) => {
    const h = {
      Accept: 'application/json,text/xml',
      foo: 'bar',
    };
    try {
      validateResponseType(h, responseHeaders);
      done(new Error('expecting error due to mismatch'));
    } catch (err) {
      expect(err).to.have.property('message',
        'Accept application/json,text/xml but got text/html');
      done();
    }
  });

  it('SGT specifies an Accept header with multiple values, one value ' +
  'matches res content type', (done) => {
    const h = {
      Accept: 'text/html, text/xml',
      foo: 'bar',
    };
    try {
      const actual = validateResponseType(h, responseHeaders);
      expect(actual).to.equal(true);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('full wildcard', (done) => {
    const h = {
      Accept: 'text/xml,*/*',
      foo: 'bar',
    };
    try {
      const actual = validateResponseType(h, responseHeaders);
      expect(actual).to.equal(true);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('type wildcard matches', (done) => {
    const h = {
      Accept: 'text/xml,text/*',
      foo: 'bar',
    };
    try {
      const actual = validateResponseType(h, responseHeaders);
      expect(actual).to.equal(true);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('type wildcard no match', (done) => {
    const h = {
      Accept: 'text/xml,application/*',
      foo: 'bar',
    };
    try {
      const actual = validateResponseType(h, responseHeaders);
      expect(actual).to.equal(true);
      done(new Error('Expecting error due to mismatch'));
    } catch (err) {
      expect(err).to.have.property('message',
        'Accept text/xml,application/* but got text/html');
      done();
    }
  });

  it('subtype wildcard matches', (done) => {
    const h = {
      Accept: 'text/xml,*/html',
      foo: 'bar',
    };
    try {
      const actual = validateResponseType(h, responseHeaders);
      expect(actual).to.equal(true);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('type wildcard no match', (done) => {
    const h = {
      Accept: 'text/xml,*/json',
      foo: 'bar',
    };
    try {
      const actual = validateResponseType(h, responseHeaders);
      expect(actual).to.equal(true);
      done(new Error('Expecting error due to mismatch'));
    } catch (err) {
      expect(err).to.have.property('message',
        'Accept text/xml,*/json but got text/html');
      done();
    }
  });
});
