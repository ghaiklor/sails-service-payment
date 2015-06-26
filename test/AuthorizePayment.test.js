var assert = require('chai').assert;
var AuthorizePayment = require('../lib/AuthorizePayment');

describe('AuthorizePayment', function () {
  it('Should properly export', function () {
    assert.isFunction(AuthorizePayment);
  });
});
