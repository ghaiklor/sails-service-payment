var StripePayment = require('./StripePayment');

module.exports = {
  create: function (type, options) {
    switch (type) {
      case 'stripe':
        return new StripePayment(options);
      default:
        throw new Error('Unrecognized type -> ' + type);
    }
  },

  Stripe: StripePayment
};
