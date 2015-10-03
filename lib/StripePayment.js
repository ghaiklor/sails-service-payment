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
 * Create a customer
 * @param {Object} subscriptionInfo Credit card data and user info
 * @param {Object} [_config] Additional configuration for provider
 * @returns {Promise}
 * @example
 * stripePayment.subscribe({
 *  plan: 'basic',
 *  email: 'test@test.com',
 *  cardNumber: '4242424242424242',
 *  cardHolderName: 'Eugene Obrezkov',
 *  expMonth: '01',
 *  expYear: '2018',
 *  cvv: '123'
 * });
 */
StripePayment.prototype.createCustomer = function (customerInfo, _config) {
  var config = _.merge({
    email: customerInfo.email,
    phone: customerInfo.phone,
    source: {
      object: 'card',
      number: customerInfo.cardNumber,
      exp_month: customerInfo.expMonth,
      exp_year: customerInfo.expYear,
      cvc: customerInfo.cvv,
      name: customerInfo.cardHolderName
    }
  }, _config);

  return new Promise(function (resolve, reject) {
    this.getProvider().customers.create(config, function (error, result) {
      return error ? reject(error) : resolve(result);
    });
  }.bind(this));
};

/**
 * Create subscription for customer
 * @param {Object} subscriptionInfo Credit card data and user info
 * @param {Object} [_config] Additional configuration for provider
 * @returns {Promise}
 * @example
 * stripePayment.subscribeCustomer({
 *  identifier: 'cus_71HKlJSGYHgk5p' CustomerId returned from create customer method
 *  plan: 'basic',
 * });
 */
StripePayment.prototype.subscribeCustomer = function (subscriptionInfo, _config) {
  var config = _.merge({
    plan: subscriptionInfo.plan
  }, _config);

  return new Promise(function (resolve, reject) {
    this.getProvider().customers.createSubscription(subscriptionInfo.identifier, config, function (error, result) {
      return error ? reject(error) : resolve(result);
    });
  }.bind(this));
};

/**
 * Create a customer and subscribe them to plan
 * @param {Object} subscriptionInfo Credit card data and user info
 * @param {Object} [_config] Additional configuration for provider
 * @returns {Promise}
 * @example
 * stripePayment.subscribe({
 *  plan: 'basic',
 *  email: 'test@test.com',
 *  cardNumber: '4242424242424242',
 *  cardHolderName: 'Eugene Obrezkov',
 *  expMonth: '01',
 *  expYear: '2018',
 *  cvv: '123'
 * });
 */
StripePayment.prototype.createAndSubscribe = function (customerInfo, _config) {
  var config = _.merge({
    email: customerInfo.email,
    plan: customerInfo.plan,
    phone: customerInfo.phone,
    source: {
      object: 'card',
      number: customerInfo.cardNumber,
      exp_month: customerInfo.expMonth,
      exp_year: customerInfo.expYear,
      cvc: customerInfo.cvv,
      name: customerInfo.cardHolderName
    }
  }, _config);

  return new Promise(function (resolve, reject) {
    this.getProvider().customers.create(config, function (error, result) {
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

/**
 * Cancel a customers subscription
 * @param {String} customerId
 * @param {String} subscriptionId
 * @returns {Promise}
 */
StripePayment.prototype.cancelSubscription = function (subscription) {
  return new Promise(function (resolve, reject) {
    this.getProvider().customers.cancelSubscription(subscription.customerId, subscription.subscriptionId, function (error, result) {
      return error ? reject(error) : resolve(result);
    });
  }.bind(this));
};

module.exports = StripePayment;
