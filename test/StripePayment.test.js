var assert = require('chai').assert;
var sinon = require('sinon');
var StripePayment = require('../lib/StripePayment');

var PROVIDER_CONFIG = {
  apiKey: ''
};

var CHECKOUT_CONFIG = {
  description: 'TEST',
  amount: 100 * 10,
  cardNumber: '4242424242424242',
  cardHolderName: 'Eugene Obrezkov',
  expMonth: '01',
  expYear: '2018',
  cvv: '123',
  currency: 'usd'
};

var CHECKOUT_CONFIG_SHOULD_BE = {
  amount: 100 * 10,
  currency: 'usd',
  description: 'TEST',
  capture: true,
  source: {
    object: 'card',
    number: '4242424242424242',
    exp_month: '01',
    exp_year: '2018',
    cvc: '123',
    name: 'Eugene Obrezkov'
  }
};

var CHECKOUT_CONFIG_EXTENDED_SHOULD_BE = {
  amount: 100 * 10,
  currency: 'usd',
  description: 'TEST',
  capture: true,
  receipt_email: 'ghaiklor@gmail.com',
  source: {
    object: 'card',
    number: '4242424242424242',
    exp_month: '01',
    exp_year: '2018',
    cvc: '123',
    name: 'Eugene Obrezkov'
  }
};

describe('StripePayment', function () {
  it('Should properly export StripePayment', function () {
    assert.isFunction(StripePayment);
  });

  it('Should properly make checkout', function (done) {
    var payment = new StripePayment({provider: PROVIDER_CONFIG});

    sinon.stub(payment.getProvider().charges, 'create', function (config, cb) {
      cb();
    });

    payment
      .checkout(CHECKOUT_CONFIG)
      .then(function () {
        assert(payment.getProvider().charges.create.calledOnce);
        assert.deepEqual(payment.getProvider().charges.create.getCall(0).args[0], CHECKOUT_CONFIG_SHOULD_BE);
        assert.isFunction(payment.getProvider().charges.create.getCall(0).args[1]);

        payment.getProvider().charges.create.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly make checkout with extended properties', function (done) {
    var payment = new StripePayment({provider: PROVIDER_CONFIG});

    sinon.stub(payment.getProvider().charges, 'create', function (config, cb) {
      cb();
    });

    payment
      .checkout(CHECKOUT_CONFIG, {
        receipt_email: 'ghaiklor@gmail.com'
      })
      .then(function () {
        assert(payment.getProvider().charges.create.calledOnce);
        assert.deepEqual(payment.getProvider().charges.create.getCall(0).args[0], CHECKOUT_CONFIG_EXTENDED_SHOULD_BE);
        assert.isFunction(payment.getProvider().charges.create.getCall(0).args[1]);

        payment.getProvider().charges.create.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly call refund method', function (done) {
    var payment = new StripePayment({provider: PROVIDER_CONFIG});

    sinon.stub(payment.getProvider().charges, 'createRefund', function (transactionId, config, cb) {
      cb();
    });

    payment
      .refund('TRANSACTION_ID')
      .then(function () {
        assert(payment.getProvider().charges.createRefund.calledOnce);
        assert.equal(payment.getProvider().charges.createRefund.getCall(0).args[0], 'TRANSACTION_ID');
        assert.deepEqual(payment.getProvider().charges.createRefund.getCall(0).args[1], {});
        assert.isFunction(payment.getProvider().charges.createRefund.getCall(0).args[2]);

        payment.getProvider().charges.createRefund.restore();

        done();
      })
      .catch(done);
  });
});
