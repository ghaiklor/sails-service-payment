var AuthorizePayment = require('./AuthorizePayment');
var BrainTreePayment = require('./BrainTreePayment');
var StripePayment = require('./StripePayment');

module.exports = {
  /**
   * Create payment instance based on type
   * @param {String} type
   * @param {Object} config
   * @returns {*}
   */
  create: function (type, config) {
    switch (type) {
      case 'authorize':
        return new AuthorizePayment(config);
      case 'braintree':
        return new BrainTreePayment(config);
      case 'stripe':
        return new StripePayment(config);
      default:
        throw new Error('Unrecognized type -> ' + type);
    }
  },

  AuthorizePayment: AuthorizePayment,
  BrainTreePayment: BrainTreePayment,
  StripePayment: StripePayment
};
