import { assert } from 'chai';
import braintree from 'braintree';
import sinon from 'sinon';
import BrainTreePayment from '../../lib/BrainTreePayment';

const PROVIDER_CONFIG = {
  sandbox: true,
  merchantId: '',
  publicKey: '',
  privateKey: ''
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
  amount: '15.35',
  creditCard: {
    number: '4242424242424242',
    cardholderName: 'Eugene Obrezkov',
    expirationMonth: '01',
    expirationYear: '2018',
    cvv: '123'
  },
  options: {
    submitForSettlement: true
  }
};

const CHECKOUT_CONFIG_EXTENDED_SHOULD_BE = {
  amount: '15.35',
  creditCard: {
    number: '4242424242424242',
    cardholderName: 'Eugene Obrezkov',
    expirationMonth: '01',
    expirationYear: '2018',
    cvv: '123'
  },
  options: {
    submitForSettlement: true
  },
  customer: {
    email: 'ghaiklor@gmail.com'
  }
};

describe('BrainTreePayment', () => {
  it('Should properly export', () => {
    assert.isFunction(BrainTreePayment);
  });

  it('Should properly create sandbox environment', () => {
    let payment = new BrainTreePayment(PROVIDER_CONFIG);

    assert.ok(payment.get('sandbox'));
    assert.deepEqual(payment.getProvider().config.environment, braintree.Environment.Sandbox);
  });

  it('Should properly create production environment', () => {
    let payment = new BrainTreePayment({sandbox: false});

    assert.notOk(payment.get('sandbox'));
    assert.deepEqual(payment.getProvider().config.environment, braintree.Environment.Production);
  });

  it('Should properly call checkout method', (done) => {
    let payment = new BrainTreePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().transaction, 'sale', (config, cb) => cb());

    payment
      .checkout(CREDIT_CARD)
      .then(() => {
        assert(payment.getProvider().transaction.sale.calledOnce);
        assert.deepEqual(payment.getProvider().transaction.sale.getCall(0).args[0], CHECKOUT_CONFIG_SHOULD_BE);
        assert.isFunction(payment.getProvider().transaction.sale.getCall(0).args[1]);

        payment.getProvider().transaction.sale.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly throw error on checkout', (done) => {
    let payment = new BrainTreePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().transaction, 'sale', (config, cb) => cb(new Error('Some error occurred')));

    payment
      .checkout(CREDIT_CARD)
      .then(done)
      .catch(error => {
        assert.instanceOf(error, Error);
        assert(payment.getProvider().transaction.sale.calledOnce);
        assert.deepEqual(payment.getProvider().transaction.sale.getCall(0).args[0], CHECKOUT_CONFIG_SHOULD_BE);
        assert.isFunction(payment.getProvider().transaction.sale.getCall(0).args[1]);

        payment.getProvider().transaction.sale.restore();

        done();
      });
  });

  it('Should properly extend properties on checkout', (done) => {
    let payment = new BrainTreePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().transaction, 'sale', (config, cb) => cb());

    payment
      .checkout(CREDIT_CARD, {
        customer: {
          email: 'ghaiklor@gmail.com'
        }
      })
      .then(() => {
        assert(payment.getProvider().transaction.sale.calledOnce);
        assert.deepEqual(payment.getProvider().transaction.sale.getCall(0).args[0], CHECKOUT_CONFIG_EXTENDED_SHOULD_BE);
        assert.isFunction(payment.getProvider().transaction.sale.getCall(0).args[1]);

        payment.getProvider().transaction.sale.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly retrieve transaction', (done) => {
    let payment = new BrainTreePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().transaction, 'find', (transactionId, cb) => cb(null, 'TRANSACTION'));

    payment
      .retrieve('TRANSACTION_ID')
      .then(transaction => {
        assert.equal(transaction, 'TRANSACTION');
        assert(payment.getProvider().transaction.find.calledOnce);
        assert.deepEqual(payment.getProvider().transaction.find.getCall(0).args[0], 'TRANSACTION_ID');
        assert.isFunction(payment.getProvider().transaction.find.getCall(0).args[1]);

        payment.getProvider().transaction.find.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly throw exception on retrieve', (done) => {
    let payment = new BrainTreePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().transaction, 'find', (transactionId, cb) => cb(new Error('Some error occurred')));

    payment
      .retrieve('TRANSACTION_ID')
      .then(done)
      .catch(error => {
        assert.instanceOf(error, Error);
        assert(payment.getProvider().transaction.find.calledOnce);
        assert.deepEqual(payment.getProvider().transaction.find.getCall(0).args[0], 'TRANSACTION_ID');
        assert.isFunction(payment.getProvider().transaction.find.getCall(0).args[1]);

        payment.getProvider().transaction.find.restore();

        done();
      });
  });

  it('Should properly call refund method', (done) => {
    let payment = new BrainTreePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().transaction, 'refund', (transactionId, cb) => cb());

    payment
      .refund('TRANSACTION_ID')
      .then(() => {
        assert(payment.getProvider().transaction.refund.calledOnce);
        assert.equal(payment.getProvider().transaction.refund.getCall(0).args[0], 'TRANSACTION_ID');
        assert.isFunction(payment.getProvider().transaction.refund.getCall(0).args[1]);

        payment.getProvider().transaction.refund.restore();

        done();
      })
      .catch(done);
  });

  it('Should properly throw exception on refund', (done) => {
    let payment = new BrainTreePayment(PROVIDER_CONFIG);

    sinon.stub(payment.getProvider().transaction, 'refund', (transactionId, cb) => cb(new Error('Some error occurred')));

    payment
      .refund('TRANSACTION_ID')
      .then(done)
      .catch(error => {
        assert.instanceOf(error, Error);
        assert(payment.getProvider().transaction.refund.calledOnce);
        assert.equal(payment.getProvider().transaction.refund.getCall(0).args[0], 'TRANSACTION_ID');
        assert.isFunction(payment.getProvider().transaction.refund.getCall(0).args[1]);

        payment.getProvider().transaction.refund.restore();

        done();
      });
  });
});
