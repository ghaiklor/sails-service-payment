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

  this.setProvider(braintree.connect({
    environment: this.get('sandbox') === false ? braintree.Environment.Production : braintree.Environment.Sandbox,
    merchantId: this.get('merchantId'),
    publicKey: this.get('publicKey'),
    privateKey: this.get('privateKey')
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
  var config = _.merge({
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
 * Create a new customer
 * @param {Object} creditCard Configuration object for charge
 * @param {Object} [_config] Additional configuration for provider
 * @returns {Promise}
 * @example
 * brainTreePayment.createCustomer({
 *  email: 'test@test.com,
 *  firstName: 'Jason',
 *  lastName: 'Knott',
 *  company: '123 Inc',
 *  website: 'http://www.123inc.com'
 *  cardNumber: '4242424242424242',
 *  cardHolderName: 'Eugene Obrezkov',
 *  expMonth: '01',
 *  expYear: '2018',
 *  cvv: '123'
 * });
 */
BrainTreePayment.prototype.createCustomer = function (customerInfo, _config) {
  var config = _.merge({
    email: customerInfo.email,
    phone: customerInfo.phone,
    creditCard: {
      number: customerInfo.cardNumber,
      cardholderName: customerInfo.cardHolderName,
      expirationMonth: customerInfo.expMonth,
      expirationYear: customerInfo.expYear,
      cvv: customerInfo.cvv
    }
  }, _config);

  return new Promise(function (resolve, reject) {
    this.getProvider().customer.create(config, function (error, result) {
      return error ? reject(error) : resolve(result);
    });
  }.bind(this));
};

/**
 * Create a new subscription for customer
 * @param {Object} subscriptionInfo Configuration object for charge
 * @param {Object} [_config] Additional configuration for provider
 * @returns {Promise}
 * @example
 * brainTreePayment.subscribeCustomer({
 *  identifier: payMethodToken(returned after create customer),
 *  plan: 'basic'
 * });
 */
BrainTreePayment.prototype.subscribeCustomer = function (subscriptionInfo, _config) {
  var config = _.merge({
    paymentMethodToken: subscriptionInfo.identifier,
    planId: subscriptionInfo.plan
  }, _config);

  return new Promise(function (resolve, reject) {
    this.getProvider().subscription.create(config, function (error, result) {
      return error ? reject(error) : resolve(result);
    });
  }.bind(this));
};

/**
 * Create a new customer and subscribe them to plan
 * @param {Object} creditCard Configuration object for charge
 * @param {Object} [_config] Additional configuration for provider
 * @returns {Promise}
 * @example
 * brainTreePayment.createCustomer({
 *  email: 'test@test.com,
 *  firstName: 'Jason',
 *  lastName: 'Knott',
 *  company: '123 Inc',
 *  website: 'http://www.123inc.com'
 *  cardNumber: '4242424242424242',
 *  cardHolderName: 'Eugene Obrezkov',
 *  expMonth: '01',
 *  expYear: '2018',
 *  cvv: '123'
 *  plan: 'basic'
 * });
 */
BrainTreePayment.prototype.createAndSubscribe = function (customerInfo, _config) {
  var config = _.merge({
    firstName: customerInfo.firstName,
    lastName: customerInfo.lastName,
    company: customerInfo.company,
    email: customerInfo.email,
    website: customerInfo.website,
    phone: customerInfo.phone,
    creditCard: {
      number: customerInfo.cardNumber,
      cardholderName: customerInfo.cardHolderName,
      expirationMonth: customerInfo.expMonth,
      expirationYear: customerInfo.expYear,
      cvv: customerInfo.cvv
    }
  }, _config);

  return new Promise(function (resolve, reject) {
    var self = this;
    this.getProvider().customer.create(config, function (error, result) {
      error ? returnError(error) : addSub(result);

      function returnError(error){
        return reject(error);
      };

      function addSub(data){
        if(data.success === false){
          return reject(data.message);
        }
        self.getProvider().subscription.create({
          paymentMethodToken: data.customer.paymentMethods[0].token,
          planId: customerInfo.plan
        },function(error, result){
          return error ? reject(error) : resolve(result);
        });
      }
    });
  }.bind(this));
};
/**
 * Retrieve info about transaction
 * @param {String} transactionId Transaction ID
 * @returns {Promise}
 */
BrainTreePayment.prototype.retrieve = function (transactionId) {
  return new Promise(function (resolve, reject) {
    this.getProvider().transaction.find(transactionId, function (error, result) {
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

/**
 * Cancel a subscription
 * @param {String} subscriptionId
 * @returns {Promise}
 */
BrainTreePayment.prototype.cancelSubscription = function (subscription) {
  return new Promise(function (resolve, reject) {
    this.getProvider().subscription.cancel(subscription.subscriptionId, function (error, result) {
      return error ? reject(error) : resolve(result);
    });
  }.bind(this));
};

module.exports = BrainTreePayment;
