var assert = require('chai').assert;
var braintree = require('braintree');
var sinon = require('sinon');
var BrainTreePayment = require('../lib/BrainTreePayment');

var PROVIDER_CONFIG = {
  sandbox: true,
  merchantId: '',
  publicKey: '',
  privateKey: ''
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
  amount: '15.35',
  creditCard: {
    number: '4242424242424242',
    cardholderName: 'Eugene Obrezkov',
    expirationMonth: '01',
    expirationYear: '2018',
    cvv: '123'
  },
  options: {
    submitForSettlement: true
  }
};

var CHECKOUT_CONFIG_EXTENDED_SHOULD_BE = {
  amount: '15.35',
  creditCard: {
    number: '4242424242424242',
    cardholderName: 'Eugene Obrezkov',
    expirationMonth: '01',
    expirationYear: '2018',
    cvv: '123'
  },
  options: {
    submitForSettlement: true
  },
  customer: {
    email: 'ghaiklor@gmail.com'
  }
};

describe('BrainTreePayment', function () {
  it('Should properly export', function () {
    assert.isFunction(BrainTreePayment);
  });

  it('Should properly create sandbox environment', function () {
    var payment = new BrainTreePayment(PROVIDER_CONFIG);

    assert.ok(payment.get('sandbox'));
    assert.deepEqual(payment.getProvider().config.environment, braintree.Environment.Sandbox);
  });

  it('Should properly create production environment', function () {
    var payment = new BrainTreePayment({
      sandbox: false
    });

    assert.notOk(payment.get('sandbox'));
    assert.deepEqual(payment.getProvider().config.environment, braintree.Environment.Production);
  });

  it('Should properly call checkout method', function (done) {
    var payment = new BrainTreePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().transaction, 'sale', function (config, cb) {
      cb();
    });

    payment
      .checkout(CREDIT_CARD)
      .then(function () {
        assert(payment.getProvider().transaction.sale.calledOnce);
        assert.deepEqual(payment.getProvider().transaction.sale.getCall(0).args[0], CHECKOUT_CONFIG_SHOULD_BE);
        assert.isFunction(payment.getProvider().transaction.sale.getCall(0).args[1]);

        payment.getProvider().transaction.sale.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly throw error on checkout', function (done) {
    var payment = new BrainTreePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().transaction, 'sale', function (config, cb) {
      cb(new Error('Some error occurred'));
    });

    payment
      .checkout(CREDIT_CARD)
      .then(done)
      .catch(function (error) {
        assert.instanceOf(error, Error);
        assert(payment.getProvider().transaction.sale.calledOnce);
        assert.deepEqual(payment.getProvider().transaction.sale.getCall(0).args[0], CHECKOUT_CONFIG_SHOULD_BE);
        assert.isFunction(payment.getProvider().transaction.sale.getCall(0).args[1]);

        payment.getProvider().transaction.sale.restore();

        done();
      });
  });

  it('Should properly extend properties on checkout', function (done) {
    var payment = new BrainTreePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().transaction, 'sale', function (config, cb) {
      cb();
    });

    payment
      .checkout(CREDIT_CARD, {
        customer: {
          email: 'ghaiklor@gmail.com'
        }
      })
      .then(function () {
        assert(payment.getProvider().transaction.sale.calledOnce);
        assert.deepEqual(payment.getProvider().transaction.sale.getCall(0).args[0], CHECKOUT_CONFIG_EXTENDED_SHOULD_BE);
        assert.isFunction(payment.getProvider().transaction.sale.getCall(0).args[1]);

        payment.getProvider().transaction.sale.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly retrieve transaction', function (done) {
    var payment = new BrainTreePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().transaction, 'find', function (transactionId, cb) {
      cb(null, 'TRANSACTION');
    });

    payment
      .retrieve('TRANSACTION_ID')
      .then(function (transaction) {
        assert.equal(transaction, 'TRANSACTION');
        assert(payment.getProvider().transaction.find.calledOnce);
        assert.deepEqual(payment.getProvider().transaction.find.getCall(0).args[0], 'TRANSACTION_ID');
        assert.isFunction(payment.getProvider().transaction.find.getCall(0).args[1]);

        payment.getProvider().transaction.find.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly throw exception on retrieve', function (done) {
    var payment = new BrainTreePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().transaction, 'find', function (transactionId, cb) {
      cb(new Error('Some error occurred'));
    });

    payment
      .retrieve('TRANSACTION_ID')
      .then(done)
      .catch(function (error) {
        assert.instanceOf(error, Error);
        assert(payment.getProvider().transaction.find.calledOnce);
        assert.deepEqual(payment.getProvider().transaction.find.getCall(0).args[0], 'TRANSACTION_ID');
        assert.isFunction(payment.getProvider().transaction.find.getCall(0).args[1]);

        payment.getProvider().transaction.find.restore();

        done();
      });
  });

  it('Should properly call refund method', function (done) {
    var payment = new BrainTreePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().transaction, 'refund', function (transactionId, cb) {
      cb();
    });

    payment
      .refund('TRANSACTION_ID')
      .then(function () {
        assert(payment.getProvider().transaction.refund.calledOnce);
        assert.equal(payment.getProvider().transaction.refund.getCall(0).args[0], 'TRANSACTION_ID');
        assert.isFunction(payment.getProvider().transaction.refund.getCall(0).args[1]);

        payment.getProvider().transaction.refund.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly throw exception on refund', function (done) {
    var payment = new BrainTreePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().transaction, 'refund', function (transactionId, cb) {
      cb(new Error('Some error occurred'));
    });

    payment
      .refund('TRANSACTION_ID')
      .then(done)
      .catch(function (error) {
        assert.instanceOf(error, Error);
        assert(payment.getProvider().transaction.refund.calledOnce);
        assert.equal(payment.getProvider().transaction.refund.getCall(0).args[0], 'TRANSACTION_ID');
        assert.isFunction(payment.getProvider().transaction.refund.getCall(0).args[1]);

        payment.getProvider().transaction.refund.restore();

        done();
      });
  });
});
