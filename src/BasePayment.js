import _ from 'lodash';

export default class BasePayment {
  constructor(config) {
    this._config = {};
    this._provider = {};

    _.assign(this._config, config);
  }

  /**
   * Get configuration value from the config
   * @param {String} [path]
   * @returns {*}
   */
  get(path) {
    return typeof path === 'undefined' ? this._config : _.get(this._config, path);
  }

  /**
   * Set new configuration value
   * @param {String} path
   * @param {*} value
   * @returns {BasePayment}
   */
  set(path, value) {
    _.set(this._config, path, value);
    return this;
  }

  /**
   * Get payment provider from the current instance
   * @returns {*}
   */
  getProvider() {
    return this._provider;
  }

  /**
   * Set new payment provider instance
   * @param {Object} provider
   * @returns {BasePayment}
   */
  setProvider(provider) {
    this._provider = provider;
    return this;
  }
}
