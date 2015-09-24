import { assert } from 'chai';
import sinon from 'sinon';
import StripePayment from '../../lib/StripePayment';

const PROVIDER_CONFIG = {
  apiKey: ''
};

const CREDIT_CARD = {
  amount: 100 * 15.35,
  cardNumber: '4242424242424242',
  cardHolderName: 'Eugene Obrezkov',
  expMonth: '01',
  expYear: '2018',
  cvv: '123'
};

const CHECKOUT_CONFIG_SHOULD_BE = {
  amount: 1535,
  currency: 'usd',
  capture: true,
  source: {
    object: 'card',
    number: '4242424242424242',
    exp_month: '01',
    exp_year: '2018',
    cvc: '123',
    name: 'Eugene Obrezkov'
  }
};

const CHECKOUT_CONFIG_EXTENDED_SHOULD_BE = {
  amount: 1535,
  currency: 'usd',
  capture: true,
  receipt_email: 'ghaiklor@gmail.com',
  source: {
    object: 'card',
    number: '4242424242424242',
    exp_month: '01',
    exp_year: '2018',
    cvc: '123',
    name: 'Eugene Obrezkov'
  }
};

describe('StripePayment', () => {
  it('Should properly export StripePayment', () => {
    assert.isFunction(StripePayment);
  });

  it('Should properly make checkout', (done) => {
    let payment = new StripePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().charges, 'create', (config, cb) => cb(null, 'CHARGE'));

    payment
      .checkout(CREDIT_CARD)
      .then((charge) => {
        assert.equal(charge, 'CHARGE');
        assert(payment.getProvider().charges.create.calledOnce);
        assert.deepEqual(payment.getProvider().charges.create.getCall(0).args[0], CHECKOUT_CONFIG_SHOULD_BE);
        assert.isFunction(payment.getProvider().charges.create.getCall(0).args[1]);

        payment.getProvider().charges.create.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly throw exception on checkout', (done) => {
    let payment = new StripePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().charges, 'create', (config, cb) => cb(new Error('Some error occurred')));

    payment
      .checkout(CREDIT_CARD)
      .then(done)
      .catch((error) => {
        assert.instanceOf(error, Error);
        assert(payment.getProvider().charges.create.calledOnce);
        assert.deepEqual(payment.getProvider().charges.create.getCall(0).args[0], CHECKOUT_CONFIG_SHOULD_BE);
        assert.isFunction(payment.getProvider().charges.create.getCall(0).args[1]);

        payment.getProvider().charges.create.restore();

        done();
      });
  });

  it('Should properly make checkout with extended properties', (done) => {
    let payment = new StripePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().charges, 'create', (config, cb) => cb());

    payment
      .checkout(CREDIT_CARD, {receipt_email: 'ghaiklor@gmail.com'})
      .then(() => {
        assert(payment.getProvider().charges.create.calledOnce);
        assert.deepEqual(payment.getProvider().charges.create.getCall(0).args[0], CHECKOUT_CONFIG_EXTENDED_SHOULD_BE);
        assert.isFunction(payment.getProvider().charges.create.getCall(0).args[1]);

        payment.getProvider().charges.create.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly retrieve info about transaction', (done) => {
    let payment = new StripePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().charges, 'retrieve', (transactionId, cb) => cb(null, 'TRANSACTION'));

    payment
      .retrieve('TRANSACTION_ID')
      .then((transaction) => {
        assert.equal(transaction, 'TRANSACTION');
        assert(payment.getProvider().charges.retrieve.calledOnce);
        assert.deepEqual(payment.getProvider().charges.retrieve.getCall(0).args[0], 'TRANSACTION_ID');
        assert.isFunction(payment.getProvider().charges.retrieve.getCall(0).args[1]);

        payment.getProvider().charges.retrieve.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly throw exception on getting info about transaction', (done) => {
    let payment = new StripePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().charges, 'retrieve', (transactionId, cb) => cb(new Error('Some error occurred')));

    payment
      .retrieve('TRANSACTION_ID')
      .then(done)
      .catch((error) => {
        assert.instanceOf(error, Error);
        assert(payment.getProvider().charges.retrieve.calledOnce);
        assert.deepEqual(payment.getProvider().charges.retrieve.getCall(0).args[0], 'TRANSACTION_ID');
        assert.isFunction(payment.getProvider().charges.retrieve.getCall(0).args[1]);

        payment.getProvider().charges.retrieve.restore();

        done();
      });
  });

  it('Should properly call refund method', (done) => {
    let payment = new StripePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().charges, 'createRefund', (transactionId, config, cb) => cb(null, 'REFUND'));

    payment
      .refund('TRANSACTION_ID')
      .then((refund) => {
        assert.equal(refund, 'REFUND');
        assert(payment.getProvider().charges.createRefund.calledOnce);
        assert.equal(payment.getProvider().charges.createRefund.getCall(0).args[0], 'TRANSACTION_ID');
        assert.isObject(payment.getProvider().charges.createRefund.getCall(0).args[1]);
        assert.isFunction(payment.getProvider().charges.createRefund.getCall(0).args[2]);

        payment.getProvider().charges.createRefund.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly throw exception on refund', (done) => {
    let payment = new StripePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().charges, 'createRefund', (transactionId, config, cb) => cb(new Error('Some error occurred')));

    payment
      .refund('TRANSACTION_ID')
      .then(done)
      .catch((error) => {
        assert.instanceOf(error, Error);
        assert(payment.getProvider().charges.createRefund.calledOnce);
        assert.equal(payment.getProvider().charges.createRefund.getCall(0).args[0], 'TRANSACTION_ID');
        assert.isObject(payment.getProvider().charges.createRefund.getCall(0).args[1]);
        assert.isFunction(payment.getProvider().charges.createRefund.getCall(0).args[2]);

        payment.getProvider().charges.createRefund.restore();

        done();
      });
  });
});
