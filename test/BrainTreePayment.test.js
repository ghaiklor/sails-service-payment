var assert = require('chai').assert;
var sinon = require('sinon');
var BrainTreePayment = require('../lib/BrainTreePayment');

var PROVIDER_CONFIG = {
  sandbox: true,
  merchantId: '',
  publicKey: '',
  privateKey: ''
};

var CHECKOUT_CONFIG = {
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

  it('Should properly call checkout method', function (done) {
    var payment = new BrainTreePayment({provider: PROVIDER_CONFIG});

    sinon.stub(payment.getProvider().transaction, 'sale', function (config, cb) {
      cb();
    });

    payment
      .checkout(CHECKOUT_CONFIG)
      .then(function () {
        assert(payment.getProvider().transaction.sale.calledOnce);
        assert.deepEqual(payment.getProvider().transaction.sale.getCall(0).args[0], CHECKOUT_CONFIG_SHOULD_BE);
        assert.isFunction(payment.getProvider().transaction.sale.getCall(0).args[1]);

        payment.getProvider().transaction.sale.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly extend properties on checkout', function (done) {
    var payment = new BrainTreePayment({provider: PROVIDER_CONFIG});

    sinon.stub(payment.getProvider().transaction, 'sale', function (config, cb) {
      cb();
    });

    payment
      .checkout(CHECKOUT_CONFIG, {
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

  it('Should properly call refund method', function (done) {
    var payment = new BrainTreePayment({provider: PROVIDER_CONFIG});

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
});
