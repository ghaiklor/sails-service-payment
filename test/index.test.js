var assert = require('chai').assert;
var PaymentService = require('../');
var BrainTreePayment = require('../lib/BrainTreePayment');
var StripePayment = require('../lib/StripePayment');

describe('PaymentService', function () {
  it('Should properly export', function () {
    assert.isObject(PaymentService);
    assert.isFunction(PaymentService.BrainTreePayment);
    assert.isFunction(PaymentService.StripePayment);
  });
});
