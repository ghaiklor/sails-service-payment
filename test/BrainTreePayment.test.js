var assert = require('chai').assert;
var BrainTreePayment = require('../lib/BrainTreePayment');

describe('BrainTreePayment', function () {
  it('Should properly export', function () {
    assert.isFunction(BrainTreePayment);
  });
});
