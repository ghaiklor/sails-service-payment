var util = require('util');
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

  this.setProvider(stripe(this.getConfig('apiKey')));
}

/**
 * Checkout credit card
 * @param {Object} config Additional configuration
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
StripePayment.prototype.checkout = function (config) {
  return new Promise(function (resolve, reject) {
    this.getProvider().charges.create({
      amount: config.amount,
      currency: config.currency || 'usd',
      description: config.description,
      capture: true,
      source: {
        object: 'card',
        number: config.cardNumber,
        exp_month: config.expMonth,
        exp_year: config.expYear,
        cvc: config.cvv,
        name: config.cardHolderName
      }
    }, function (error, result) {
      return error ? reject(error) : resolve(result);
    });
  }.bind(this));
};

module.exports = StripePayment;
