var assert = require('chai').assert;
var sinon = require('sinon');
var StripePayment = require('../lib/StripePayment');

var PROVIDER_CONFIG = {
  apiKey: ''
};

var CREDIT_CARD = {
  amount: 100 * 15.35,
  cardNumber: '4242424242424242',
  cardHolderName: 'Eugene Obrezkov',
  expMonth: '01',
  expYear: '2018',
  cvv: '123'
};

var CHECKOUT_CONFIG_SHOULD_BE = {
  amount: 1535,
  currency: 'usd',
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
  amount: 1535,
  currency: 'usd',
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
    var payment = new StripePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().charges, 'create', function (config, cb) {
      cb(null, 'CHARGE');
    });

    payment
      .checkout(CREDIT_CARD)
      .then(function (charge) {
        assert.equal(charge, 'CHARGE');
        assert(payment.getProvider().charges.create.calledOnce);
        assert.deepEqual(payment.getProvider().charges.create.getCall(0).args[0], CHECKOUT_CONFIG_SHOULD_BE);
        assert.isFunction(payment.getProvider().charges.create.getCall(0).args[1]);

        payment.getProvider().charges.create.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly throw exception on checkout', function (done) {
    var payment = new StripePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().charges, 'create', function (config, cb) {
      cb(new Error('Some error occurred'));
    });

    payment
      .checkout(CREDIT_CARD)
      .then(done)
      .catch(function (error) {
        assert.instanceOf(error, Error);
        assert(payment.getProvider().charges.create.calledOnce);
        assert.deepEqual(payment.getProvider().charges.create.getCall(0).args[0], CHECKOUT_CONFIG_SHOULD_BE);
        assert.isFunction(payment.getProvider().charges.create.getCall(0).args[1]);

        payment.getProvider().charges.create.restore();

        done();
      });
  });

  it('Should properly make checkout with extended properties', function (done) {
    var payment = new StripePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().charges, 'create', function (config, cb) {
      cb();
    });

    payment
      .checkout(CREDIT_CARD, {
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

  it('Should properly retrieve info about transaction', function (done) {
    var payment = new StripePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().charges, 'retrieve', function (transactionId, cb) {
      cb(null, 'TRANSACTION');
    });

    payment
      .retrieve('TRANSACTION_ID')
      .then(function (transaction) {
        assert.equal(transaction, 'TRANSACTION');
        assert(payment.getProvider().charges.retrieve.calledOnce);
        assert.deepEqual(payment.getProvider().charges.retrieve.getCall(0).args[0], 'TRANSACTION_ID');
        assert.isFunction(payment.getProvider().charges.retrieve.getCall(0).args[1]);

        payment.getProvider().charges.retrieve.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly throw exception on getting info about transaction', function (done) {
    var payment = new StripePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().charges, 'retrieve', function (transactionId, cb) {
      cb(new Error('Some error occurred'));
    });

    payment
      .retrieve('TRANSACTION_ID')
      .then(done)
      .catch(function (error) {
        assert.instanceOf(error, Error);
        assert(payment.getProvider().charges.retrieve.calledOnce);
        assert.deepEqual(payment.getProvider().charges.retrieve.getCall(0).args[0], 'TRANSACTION_ID');
        assert.isFunction(payment.getProvider().charges.retrieve.getCall(0).args[1]);

        payment.getProvider().charges.retrieve.restore();

        done();
      });
  });

  it('Should properly call refund method', function (done) {
    var payment = new StripePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().charges, 'createRefund', function (transactionId, config, cb) {
      cb(null, 'REFUND');
    });

    payment
      .refund('TRANSACTION_ID')
      .then(function (refund) {
        assert.equal(refund, 'REFUND');
        assert(payment.getProvider().charges.createRefund.calledOnce);
        assert.equal(payment.getProvider().charges.createRefund.getCall(0).args[0], 'TRANSACTION_ID');
        assert.isObject(payment.getProvider().charges.createRefund.getCall(0).args[1]);
        assert.isFunction(payment.getProvider().charges.createRefund.getCall(0).args[2]);

        payment.getProvider().charges.createRefund.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly throw exception on refund', function (done) {
    var payment = new StripePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().charges, 'createRefund', function (transactionId, config, cb) {
      cb(new Error('Some error occurred'));
    });

    payment
      .refund('TRANSACTION_ID')
      .then(done)
      .catch(function (error) {
        assert.instanceOf(error, Error);
        assert(payment.getProvider().charges.createRefund.calledOnce);
        assert.equal(payment.getProvider().charges.createRefund.getCall(0).args[0], 'TRANSACTION_ID');
        assert.isObject(payment.getProvider().charges.createRefund.getCall(0).args[1]);
        assert.isFunction(payment.getProvider().charges.createRefund.getCall(0).args[2]);

        payment.getProvider().charges.createRefund.restore();

        done();
      });
  });
});
