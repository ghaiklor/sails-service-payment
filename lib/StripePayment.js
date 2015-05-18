var Promise = require('bluebird');
var stripe = require('stripe');

/**
 * Triggers when operation is finished
 * @param resolve
 * @param reject
 * @param error
 * @param data
 * @returns {*}
 * @private
 */
function _onOperationFinished(resolve, reject, error, data) {
  return error ? reject(error) : resolve(data);
}

/**
 * Create new Stripe payment instance
 * @param {Object} config
 * @constructor
 */
function StripePayment(config) {
  if (!(config || config || config.apiKey)) {
    throw new Error('You must provide apiKey');
  }

  this._config = config || {};
  this._stripe = stripe(this._config.apiKey);
}

StripePayment.prototype = Object.create({
  constructor: StripePayment,

  /**
   * To charge a credit card, you create a new charge object.
   * @param {Object} options Options https://stripe.com/docs/api/node#create_charge
   * @returns {StripePayment}
   */
  createCharge: function (options) {
    return new Promise(function (resolve, reject) {
      stripe.charges.create(options, _onOperationFinished.bind(this, resolve, reject));
    });
  },

  /**
   * Retrieves the details of a charge that has previously been created.
   * @param {Object} options Options https://stripe.com/docs/api/node#retrieve_charge
   * @returns {StripePayment}
   */
  retrieveCharge: function (options) {
    return new Promise(function (resolve, reject) {
      stripe.charges.retrieve(options.id, _onOperationFinished.bind(this, resolve, reject));
    });
  },

  /**
   * Create Customer
   * @param {Object} options Options https://stripe.com/docs/api/node#create_customer
   * @returns {StripePayment}
   */
  createCustomer: function (options) {
    return new Promise(function (resolve, reject) {
      stripe.customers.create(options, _onOperationFinished.bind(this, resolve, reject));
    });
  },

  /**
   * Update Customer
   * @param {object} options https://stripe.com/docs/api/node#update_customer
   * @returns {StripePayment}
   */
  updateCustomer: function (options) {
    return new Promise(function (resolve, reject) {
      stripe.customers.update(options, _onOperationFinished.bind(this, resolve, reject));
    });
  },

  /**
   * Delete Customer
   * @param {object} options https://stripe.com/docs/api/node#delete_customer
   * @returns {StripePayment}
   */
  customerDelete: function (options) {
    return new Promise(function (resolve, reject) {
      stripe.customers.del(options.id, _onOperationFinished.bind(this, resolve, reject));
    });
  },

  /**
   * Returns a list of your customers.
   * @param {object} options https://stripe.com/docs/api/node#delete_customer
   * @returns {StripePayment}
   */
  customersList: function (options) {
    return new Promise(function (resolve, reject) {
      stripe.customers.list(options, _onOperationFinished.bind(this, resolve, reject));
    });
  },

  /**
   * create a new plan
   * @param {object} options https://stripe.com/docs/api/node#create_plan
   * @returns {StripePayment}
   */
  createPlan: function (options) {
    return new Promise(function (resolve, reject) {
      stripe.plans.create(options, _onOperationFinished.bind(this, resolve, reject));
    });
  },

  /**
   * Retrieves the plan with the given ID.
   * @param {object} options https://stripe.com/docs/api/node#retrieve_plan
   * @returns {StripePayment}
   */
  getPlan: function (options) {
    return new Promise(function (resolve, reject) {
      stripe.plans.retrieve(options.id, _onOperationFinished.bind(this, resolve, reject));
    });
  },

  /**
   * Updates the name of a plan. Other plan details (price, interval, etc.) are, by design, not editable.
   * @param {Number} planId
   * @param {Object} options https://stripe.com/docs/api/node#update_plan
   * @returns {StripePayment}
   */
  updatePlan: function (planId, options) {
    return new Promise(function (resolve, reject) {
      stripe.plans.update(planId, options, _onOperationFinished.bind(this, resolve, reject));
    });
  },

  /**
   * Returns a list of your plans
   * https://stripe.com/docs/api/node#list_plans
   * @returns {StripePayment}
   */
  listPlan: function () {
    return new Promise(function (resolve, reject) {
      stripe.plans.list(_onOperationFinished.bind(this, resolve, reject));
    });
  }
});

module.exports = StripePayment;
