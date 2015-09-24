var util = require('util');
var _ = require('lodash');
var Promise = require('bluebird');
var stripe = require('stripe');
var BasePayment = require('./BasePayment');

util.inherits(StripePayment, BasePayment);

/**
 * Create new Stripe payment instance
 * @constructor
 */
function StripePayment() {
  BasePayment.apply(this, arguments);

  this.setProvider(stripe(this.get('apiKey')));
}

/**
 * Checkout credit card
 * @param {Object} creditCard Credit card data
 * @param {Object} [_config] Additional configuration for provider
 * @returns {Promise}
 * @example
 * stripePayment.checkout({
 *  amount: '10.00',
 *  cardNumber: '4242424242424242',
 *  cardHolderName: 'Eugene Obrezkov',
 *  expMonth: '01',
 *  expYear: '2018',
 *  cvv: '123'
 * });
 */
StripePayment.prototype.checkout = function (creditCard, _config) {
  var config = _.merge({
    amount: creditCard.amount,
    currency: 'usd',
    capture: true,
    source: {
      object: 'card',
      number: creditCard.cardNumber,
      exp_month: creditCard.expMonth,
      exp_year: creditCard.expYear,
      cvc: creditCard.cvv,
      name: creditCard.cardHolderName
    }
  }, _config);

  return new Promise(function (resolve, reject) {
    this.getProvider().charges.create(config, function (error, result) {
      return error ? reject(error) : resolve(result);
    });
  }.bind(this));
};

/**
 * Retrieve information about transaction
 * @param {String} transactionId
 * @returns {Promise}
 */
StripePayment.prototype.retrieve = function (transactionId) {
  return new Promise(function (resolve, reject) {
    this.getProvider().charges.retrieve(transactionId, function (error, charge) {
      return error ? reject(error) : resolve(charge);
    });
  }.bind(this));
};

/**
 * Refunds already settled payment
 * @param {String} transactionId Transaction ID
 * @returns {Promise}
 */
StripePayment.prototype.refund = function (transactionId) {
  return new Promise(function (resolve, reject) {
    this.getProvider().charges.createRefund(transactionId, {}, function (error, result) {
      return error ? reject(error) : resolve(result);
    });
  }.bind(this));
};

module.exports = StripePayment;
