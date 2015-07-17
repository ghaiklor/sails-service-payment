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
 *  description: 'Some payment description',
 *  amount: '10.00',
 *  cardNumber: '4242424242424242',
 *  cardHolderName: 'Eugene Obrezkov',
 *  expMonth: '01',
 *  expYear: '2018',
 *  cvv: '123',
 *  currency: 'usd'
 * });
 */
StripePayment.prototype.checkout = function (creditCard, _config) {
  var config = _.merge({}, {
    amount: creditCard.amount,
    currency: creditCard.currency || 'usd',
    description: creditCard.description,
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
 * Refunds already settled payment
 * @param {String} transactionId Transaction ID
 * @param {Object} [_config] Additional configuration for provider
 * @returns {Promise}
 */
StripePayment.prototype.refund = function (transactionId, _config) {
  var config = _.merge({}, _config);

  return new Promise(function (resolve, reject) {
    this.getProvider().charges.createRefund(transactionId, config, function (error, result) {
      return error ? reject(error) : resolve(result);
    });
  }.bind(this));
};

module.exports = StripePayment;
