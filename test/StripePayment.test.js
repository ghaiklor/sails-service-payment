var assert = require('chai').assert;
var StripePayment = require('../lib/StripePayment');

describe('StripePayment', function () {
  it('Should properly export StripePayment', function () {
    assert.isFunction(StripePayment);
  });
});
