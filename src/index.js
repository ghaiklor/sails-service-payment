import BrainTreePayment from './BrainTreePayment';
import StripePayment from './StripePayment';

const payment = {
  braintree: BrainTreePayment,
  stripe: StripePayment
};

/**
 * Create payment instance based on type
 * @param {String} type Payment type
 * @param {Object} [config] Configuration for payment class
 * @returns {*}
 */
export default function (type, config) {
  if (payment[type.toLowerCase()] instanceof Function) {
    return new payment[type.toLowerCase()](config);
  } else {
    throw new Error('Unrecognized type -> ' + type);
  }
};
