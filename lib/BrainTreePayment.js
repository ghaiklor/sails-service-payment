var util = require('util');
var _ = require('lodash');
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

  var provider = this.get('provider');

  this.setProvider(braintree.connect({
    environment: provider.sandbox === false ? braintree.Environment.Production : braintree.Environment.Sandbox,
    merchantId: provider.merchantId,
    publicKey: provider.publicKey,
    privateKey: provider.privateKey
  }));
}

/**
 * Create charge for credit card
 * @param {Object} creditCard Configuration object for charge
 * @param {Object} [_config] Additional configuration for provider
 * @returns {Promise}
 * @example
 * brainTreePayment.checkout({
 *  amount: 1000,
 *  cardNumber: '4242424242424242',
 *  cardHolderName: 'Eugene Obrezkov',
 *  expMonth: '01',
 *  expYear: '2018',
 *  cvv: '123'
 * });
 */
BrainTreePayment.prototype.checkout = function (creditCard, _config) {
  var config = _.merge({}, {
    amount: (creditCard.amount / 100.0).toFixed(2).toString(),
    creditCard: {
      number: creditCard.cardNumber,
      cardholderName: creditCard.cardHolderName,
      expirationMonth: creditCard.expMonth,
      expirationYear: creditCard.expYear,
      cvv: creditCard.cvv
    },
    options: {
      submitForSettlement: true
    }
  }, _config);

  return new Promise(function (resolve, reject) {
    this.getProvider().transaction.sale(config, function (error, result) {
      return error ? reject(error) : resolve(result);
    });
  }.bind(this));
};

/**
 * Refund already settled transaction
 * @param {String} transactionId Transaction ID
 * @returns {Promise}
 */
BrainTreePayment.prototype.refund = function (transactionId) {
  return new Promise(function (resolve, reject) {
    this.getProvider().transaction.refund(transactionId, function (error, result) {
      return error ? reject(error) : resolve(result);
    });
  }.bind(this));
};

module.exports = BrainTreePayment;
