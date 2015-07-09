var assert = require('chai').assert;
var BasePayment = require('../lib/BasePayment');

describe('BasePayment', function () {
  it('Should properly export', function () {
    assert.isFunction(BasePayment);
    assert.isFunction(BasePayment.prototype.getConfig);
    assert.isFunction(BasePayment.prototype.setConfig);
    assert.isFunction(BasePayment.prototype.getProvider);
    assert.isFunction(BasePayment.prototype.setProvider);
    assert.isFunction(BasePayment.prototype.checkout);
    assert.isFunction(BasePayment.prototype.refund);

    assert.throw(function () {
      BasePayment.prototype.checkout();
    }, Error);

    assert.throw(function () {
      BasePayment.prototype.refund();
    }, Error);
  });

  it('Should properly make objects configurable', function () {
    var payment = new BasePayment();

    assert.notOk(payment.getConfig('foo'));
    assert.instanceOf(payment.setConfig('foo', 'bar'), BasePayment);
    assert.instanceOf(payment.setConfig('obj', {foo: 'bar'}), BasePayment);
    assert.deepEqual(payment.getConfig('obj'), {foo: 'bar'});
    assert.equal(payment.getConfig('obj').foo, 'bar');
    assert.equal(payment.getConfig('foo'), 'bar');
  });

  it('Should properly create payment with pre-defined config', function () {
    var payment = new BasePayment({
      apiKey: 'API_KEY'
    });

    assert.equal(payment.getConfig('apiKey'), 'API_KEY');
    assert.notOk(payment.getConfig('NOT_EXISTS'));
  });

  it('Should properly get/set payment provider', function () {
    var payment = new BasePayment();

    assert.notOk(payment.getProvider());
    assert.instanceOf(payment.setProvider('SOME_PROVIDER'), BasePayment);
    assert.equal(payment.getProvider(), 'SOME_PROVIDER');
  });

  it('Should properly throw error on checkout', function () {
    var payment = new BasePayment();

    assert.throw(function () {
      payment.checkout();
    }, Error);
  });

  it('Should properly throw error on refund', function () {
    var payment = new BasePayment();

    assert.throw(function () {
      payment.refund();
    }, Error);
  });
});
