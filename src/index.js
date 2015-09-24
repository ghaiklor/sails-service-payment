var payments = {
  braintree: require('./BrainTreePayment'),
  stripe: require('./StripePayment')
};

module.exports = {
  /**
   * Create payment instance based on type
   * @param {String} type Payment type
   * @param {Object} config Configuration for payment class
   * @returns {*}
   */
  create: function (type, config) {
    if (payments[type.toLowerCase()] instanceof Function) {
      return new payments[type.toLowerCase()](config);
    } else {
      throw new Error('Unrecognized type -> ' + type);
    }
  },

  BrainTreePayment: payments.braintree,
  StripePayment: payments.stripe
};
