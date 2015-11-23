import _ from 'lodash';
import braintree from 'braintree';
import BasePayment from './BasePayment';

export default class BrainTreePayment extends BasePayment {
  constructor(config) {
    super(config);

    this.setProvider(braintree.connect({
      environment: this.get('sandbox') === false ? braintree.Environment.Production : braintree.Environment.Sandbox,
      merchantId: this.get('merchantId'),
      publicKey: this.get('publicKey'),
      privateKey: this.get('privateKey')
    }));
  }

  /**
   * Create charge for credit card
   * @param {Object} _creditCard Configuration object for charge
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
  checkout(_creditCard, _config) {
    let config = _.merge({
      amount: (_creditCard.amount / 100.0).toFixed(2).toString(),
      creditCard: {
        number: _creditCard.cardNumber,
        cardholderName: _creditCard.cardHolderName,
        expirationMonth: _creditCard.expMonth,
        expirationYear: _creditCard.expYear,
        cvv: _creditCard.cvv
      },
      options: {
        submitForSettlement: true
      }
    }, _config);

    return new Promise((resolve, reject) => {
      this.getProvider().transaction.sale(config, (error, result) => error ? reject(error) : resolve(result));
    });
  }

  /**
   * Retrieve info about transaction
   * @param {String} _transactionId Transaction ID
   * @returns {Promise}
   */
  retrieve(_transactionId) {
    return new Promise((resolve, reject) => {
      this.getProvider().transaction.find(_transactionId, (error, result) => error ? reject(error) : resolve(result));
    });
  }

  /**
   * Refund already settled transaction
   * @param {String} _transactionId Transaction ID
   * @returns {Promise}
   */
  refund(_transactionId) {
    return new Promise((resolve, reject) => {
      this.getProvider().transaction.refund(_transactionId, (error, result) => error ? reject(error) : resolve(result));
    });
  }
}
