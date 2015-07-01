var util = require('util');
var Promise = require('bluebird');
var braintree = require('braintree');
var BasePayment = require('./BasePayment');

util.inherits(BrainTreePayment, BasePayment);

/**
 * Create new instance for BrainTreePayments
 * @constructor
 */
function BrainTreePayment() {
  BasePayment.apply(this, arguments);

  this.setProvider(braintree.connect({
    environment: this.getConfig('sandbox') === false ? braintree.Environment.Production : braintree.Environment.Sandbox,
    merchantId: this.getConfig('merchantId'),
    publicKey: this.getConfig('publicKey'),
    privateKey: this.getConfig('privateKey')
  }));
}

/**
 * Create transaction for BrainTree
 * @param {Object} config Configuration for transaction
 * @returns {Promise}
 * @private
 */
BrainTreePayment.prototype._createTransaction = function (config) {
  return new Promise(function (resolve, reject) {
    // TODO: creditCard option is deprecated
    this.getProvider().transaction.sale({
      amount: config.amount,
      creditCard: {
        number: config.cardNumber,
        cardholderName: config.cardHolderName,
        expirationMonth: config.expMonth,
        expirationYear: config.expYear,
        cvv: config.cvv
      },
      options: {
        submitForSettlement: true
      }
    }, function (error, result) {
      return error ? reject(error) : resolve(result);
    });
  }.bind(this));
};

/**
 * Create charge for credit card
 * @param {Object} config Configuration object for charge
 * @returns {Promise}
 * @example
 * brainTreePayment.checkout({
 *  amount: '10.00',
 *  cardNumber: '4242424242424242',
 *  cardHolderName: 'Eugene Obrezkov',
 *  expMonth: '01',
 *  expYear: '2018',
 *  cvv: '123'
 * });
 */
BrainTreePayment.prototype.checkout = function (config) {
  return this._createTransaction(config);
};

module.exports = BrainTreePayment;
