var assert = require('chai').assert;
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

describe('BrainTreePayment', function () {
  it('Should properly export', function () {
    assert.isFunction(BrainTreePayment);
  });

  it('Should properly call checkout method', function (done) {
    var payment = new BrainTreePayment(PROVIDER_CONFIG);
    payment.checkout(CHECKOUT_CONFIG).then(done).catch(done);
  });
});
