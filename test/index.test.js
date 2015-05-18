var assert = require('chai').assert;
var PaymentService = require('../');

describe('PaymentService', function () {
  it('Should properly export', function () {
    assert.isObject(PaymentService);
    assert.isFunction(PaymentService.Stripe);
  });
});
