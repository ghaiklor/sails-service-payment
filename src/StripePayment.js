import _ from 'lodash';
import stripe from 'stripe';
import BasePayment from './BasePayment';

export default class StripePayment extends BasePayment {
  constructor(config) {
    super(config);

    this.setProvider(stripe(this.get('apiKey')));
  }

  /**
   * Checkout credit card
   * @param {Object} _creditCard Credit card data
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
  checkout(_creditCard, _config) {
    let config = _.merge({
      amount: _creditCard.amount,
      currency: 'usd',
      capture: true,
      source: {
        object: 'card',
        number: _creditCard.cardNumber,
        exp_month: _creditCard.expMonth,
        exp_year: _creditCard.expYear,
        cvc: _creditCard.cvv,
        name: _creditCard.cardHolderName
      }
    }, _config);

    return new Promise((resolve, reject) => {
      this.getProvider().charges.create(config, (error, result) => error ? reject(error) : resolve(result));
    });
  }

  /**
   * Retrieve information about transaction
   * @param {String} _transactionId
   * @returns {Promise}
   */
  retrieve(_transactionId) {
    return new Promise((resolve, reject) => {
      this.getProvider().charges.retrieve(_transactionId, (error, charge) => error ? reject(error) : resolve(charge));
    });
  }

  /**
   * Refunds already settled payment
   * @param {String} _transactionId Transaction ID
   * @returns {Promise}
   */
  refund(_transactionId) {
    return new Promise((resolve, reject) => {
      this.getProvider().refunds.create({charge: _transactionId}, (error, refund) => error ? reject(error) : resolve(refund));
    });
  }
}
