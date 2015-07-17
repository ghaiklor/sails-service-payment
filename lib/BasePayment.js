var _ = require('lodash');

/**
 * Create base instance for payments
 * @param {Object} _config Configuration object
 * @constructor
 */
function BasePayment(_config) {
  this._config = {};

  _.forOwn(_config, function (value, key) {
    this.set(key, value);
  }.bind(this));
}

/**
 * Get some configuration value from config
 * @param {String} [path]
 * @returns {*}
 */
BasePayment.prototype.get = function (path) {
  return typeof path === 'undefined' ? this._config : _.get(this._config, path);
};

/**
 * Set new configuration value
 * @param {String} path
 * @param {*} value
 * @returns {BasePayment}
 */
BasePayment.prototype.set = function (path, value) {
  _.set(this._config, path, value);
  return this;
};

/**
 * Get payment provider for current instance
 * @returns {Object}
 */
BasePayment.prototype.getProvider = function () {
  return this._provider;
};

/**
 * Set new payment provider instance
 * @param {Object} provider
 * @returns {BasePayment}
 */
BasePayment.prototype.setProvider = function (provider) {
  this._provider = provider;
  return this;
};

BasePayment.prototype.checkout = _;
BasePayment.prototype.refund = _;

module.exports = BasePayment;
