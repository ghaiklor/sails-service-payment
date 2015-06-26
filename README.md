# sails-service-payment

![Build Status](https://img.shields.io/travis/ghaiklor/sails-service-payment.svg) ![Coverage](https://img.shields.io/coveralls/ghaiklor/sails-service-payment.svg) ![Downloads](https://img.shields.io/npm/dm/sails-service-payment.svg) ![npm version](https://img.shields.io/npm/v/sails-service-payment.svg) ![dependencies](https://img.shields.io/david/ghaiklor/sails-service-payment.svg) ![dev dependencies](https://img.shields.io/david/dev/ghaiklor/sails-service-payment.svg) ![License](https://img.shields.io/npm/l/sails-service-payment.svg)

Service for Sails framework with Payment features.

## List of supported payment systems

- Authorize ([docs](http://developer.authorize.net/api/reference))
- BrainTreePayments ([docs](https://developers.braintreepayments.com/javascript+node/reference/overview))
- Stripe API ([docs](https://stripe.com/docs/api/node))

## Getting Started

Install this module.

```shell
npm install sails-service-payment
```

Then require it in your service.

```javascript
// api/services/PaymentService.js
module.exports = require('sails-service-payment');
```

That's it, you can create payment instances for your needs in your project.

```javascript
// api/controllers/PaymentController.js
var stripe = PaymentService.create('stripe', {
  apiKey: '<STRIPE_API_KEY>'
});

module.exports = {
  checkout: function(req, res) {
    stripe
      .checkout({
        amount: req.param('amount'),
        currency: req.param('currency'),
        card: req.param('card'),
        expMonth: req.param('expiryMonth'),
        expYear: req.param('expiryYear')
        cvv: req.param('cvv')
      })
      .then(res.ok)
      .catch(res.serverError);
  }
};
```

## API

Each of Payment instances has few methods:

- checkout(config) - Create charge for credit card. In config you can override pre-defined options. Returns Promise;
- subscription(config) - Create recurring payment. In config you can override pre-defined options. Returns Promise;
- refund(config) - Refunds a charge that previously been created. In config you can override pre-defined options. Returns Promise;

## Examples

### StripePayment

```javascript
var stripe = PaymentService.create('stripe', {
  apiKey: '<API_KEY>'
});

stripe.checkout({
  cardNumber: '<CARD_NUMBER>',
  expireDate: '<EXPIRY_DATE>',
  cvv: '<CVV_CODE>'
});
```

## License

The MIT License (MIT)

Copyright (c) 2015 Eugene Obrezkov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
