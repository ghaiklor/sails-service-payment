# sails-service-payment

![Build Status](https://img.shields.io/travis/ghaiklor/sails-service-payment.svg) ![Coverage](https://img.shields.io/coveralls/ghaiklor/sails-service-payment.svg) ![Downloads](https://img.shields.io/npm/dm/sails-service-payment.svg) ![npm version](https://img.shields.io/npm/v/sails-service-payment.svg) ![dependencies](https://img.shields.io/david/ghaiklor/sails-service-payment.svg) ![dev dependencies](https://img.shields.io/david/dev/ghaiklor/sails-service-payment.svg) ![License](https://img.shields.io/npm/l/sails-service-payment.svg)

Service for Sails framework with Payment features.

## List of supported payment systems

- Stripe API ([docs](https://stripe.com/docs/api/node#intro))

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
        card: '<CREDIT_CARD>',
        expired: '<EXPIRY_DATE>',
        cvv: '<CVV_CODE>'
      })
      .then(res.ok)
      .catch(res.serverError);
  }
};
```

## API

Each of Payment instances has few methods

- checkout(config) - In config you can override pre-defined options when you created instance. Returns Promise.
- refund(config) - In config you can override pre-defined options when you created instance. Returns Promise.

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
