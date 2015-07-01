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
  amount: '10.00',
  cardNumber: '4242424242424242',
  cardHolderName: 'Eugene Obrezkov',
  expMonth: '01',
  expYear: '2018',
  cvv: '123'
};

var CHECKOUT_CONFIG_SHOULD_BE = {
  amount: '10.00',
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

describe('BrainTreePayment', function () {
  it('Should properly export', function () {
    assert.isFunction(BrainTreePayment);
  });

  it('Should properly call checkout method', function (done) {
    var payment = new BrainTreePayment(PROVIDER_CONFIG);

    sinon.stub(payment._provider.transaction, 'sale', function (config, cb) {
      cb();
    });

    payment
      .checkout(CHECKOUT_CONFIG)
      .then(function () {
        assert(payment._provider.transaction.sale.calledOnce);
        assert.deepEqual(payment._provider.transaction.sale.getCall(0).args[0], CHECKOUT_CONFIG_SHOULD_BE);
        assert.isFunction(payment._provider.transaction.sale.getCall(0).args[1]);

        payment._provider.transaction.sale.restore();

        done();
      })
      .catch(done);
  });
});
