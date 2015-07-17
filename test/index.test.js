var assert = require('chai').assert;
var PaymentService = require('../');
var BrainTreePayment = PaymentService.BrainTreePayment;
var StripePayment = PaymentService.StripePayment;

describe('PaymentService', function () {
  it('Should properly export', function () {
    assert.isObject(PaymentService);
    assert.isFunction(PaymentService.BrainTreePayment);
    assert.isFunction(PaymentService.StripePayment);
  });

  it('Should properly create instances', function () {
    assert.instanceOf(PaymentService.create('braintree', {}), BrainTreePayment);
    assert.instanceOf(PaymentService.create('stripe', {}), StripePayment);
  });

  it('Should properly throw exception on create unrecognised', function () {
    assert.throw(function () {
      PaymentService.create('NOT_EXISTS');
    }, Error);
  });
});
