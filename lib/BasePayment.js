/**
 * Message for error when method is not implemented
 * @type {String}
 * @private
 */
var IMPLEMENT_MESSAGE = 'Not implemented';

/**
 * Create base instance for payments
 * @param {Object} _config Configuration object
 * @constructor
 */
function BasePayment(_config) {
  var config = _config || {};

  Object.keys(config).forEach(function (key) {
    this.setConfig(key, config[key]);
  }.bind(this));
}

/**
 * Get some configuration value from config
 * @param {String} [key]
 * @returns {*}
 */
BasePayment.prototype.getConfig = function (key) {
  return typeof key === 'undefined' ? this._config : this._config && this._config[key];
};

/**
 * Set new configuration value
 * @param {String} key
 * @param {*} value
 * @returns {BasePayment}
 */
BasePayment.prototype.setConfig = function (key, value) {
  this._config = this._config || {};
  this._config[key] = value;
  return this;
};

/**
 * Proceed to checkout
 */
BasePayment.prototype.checkout = function () {
  throw new Error(IMPLEMENT_MESSAGE);
};

/**
 * Refund money
 */
BasePayment.prototype.refund = function () {
  throw new Error(IMPLEMENT_MESSAGE);
};

module.exports = BasePayment;
