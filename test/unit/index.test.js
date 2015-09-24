import { assert } from 'chai';
import PaymentService from '../../index';

describe('PaymentService', () => {
  it('Should properly export', () => {
    assert.isFunction(PaymentService);
  });

  it('Should properly create instances', () => {
    assert.equal(PaymentService('braintree', {}), BrainTreePayment);
    assert.equal(PaymentService('stripe', {}), StripePayment);
  });

  it('Should properly throw exception on create unrecognised', () => {
    assert.throw(() => PaymentService('NOT_EXISTS'), Error);
  });
});
