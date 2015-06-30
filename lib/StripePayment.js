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
 */
StripePayment.prototype.checkout = function (config) {
  return new Promise(function (resolve, reject) {
    stripe.charges.create(config, function (error, result) {
      return error ? reject(error) : resolve(result);
    });
  });
};

module.exports = StripePayment;
