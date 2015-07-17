var assert = require('chai').assert;
var BasePayment = require('../lib/BasePayment');

describe('BasePayment', function () {
  it('Should properly export', function () {
    assert.isFunction(BasePayment);
    assert.isFunction(BasePayment.prototype.get);
    assert.isFunction(BasePayment.prototype.set);
    assert.isFunction(BasePayment.prototype.getProvider);
    assert.isFunction(BasePayment.prototype.setProvider);
    assert.isFunction(BasePayment.prototype.checkout);
    assert.isFunction(BasePayment.prototype.refund);
  });

  it('Should properly make objects configurable', function () {
    var payment = new BasePayment();

    assert.notOk(payment.get('foo'));
    assert.instanceOf(payment.set('foo', 'bar'), BasePayment);
    assert.instanceOf(payment.set('obj', {foo: 'bar'}), BasePayment);
    assert.deepEqual(payment.get('obj'), {foo: 'bar'});
    assert.equal(payment.get('obj.foo'), 'bar');
    assert.equal(payment.get('foo'), 'bar');
  });

  it('Should properly create payment with pre-defined config', function () {
    var payment = new BasePayment({
      foo: 'bar',
      obj: {
        foo: 'bar'
      }
    });

    assert.deepEqual(payment.get(), {foo: 'bar', obj: {foo: 'bar'}});
    assert.equal(payment.get('foo'), 'bar');
    assert.equal(payment.get('obj.foo'), 'bar');
    assert.deepEqual(payment.get('obj'), {foo: 'bar'});
    assert.notOk(payment.get('NOT_EXISTS'));
  });

  it('Should properly get/set provider', function () {
    var payment = new BasePayment();

    assert.notOk(payment.getProvider());
    assert.instanceOf(payment.setProvider('PROVIDER'), BasePayment);
    assert.equal(payment.getProvider(), 'PROVIDER');
  });
});
