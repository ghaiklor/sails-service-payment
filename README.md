# sails-service-payment

![Build Status](https://img.shields.io/travis/ghaiklor/sails-service-payment.svg) ![Coverage](https://img.shields.io/coveralls/ghaiklor/sails-service-payment.svg) ![Downloads](https://img.shields.io/npm/dm/sails-service-payment.svg) ![npm version](https://img.shields.io/npm/v/sails-service-payment.svg) ![dependencies](https://img.shields.io/david/ghaiklor/sails-service-payment.svg) ![dev dependencies](https://img.shields.io/david/dev/ghaiklor/sails-service-payment.svg) ![License](https://img.shields.io/npm/l/sails-service-payment.svg)

Service for Sails framework with Payment features.

## List of supported payment systems

- BrainTreePayments ([docs](https://developers.braintreepayments.com/javascript+node/reference/overview))
- Stripe ([docs](https://stripe.com/docs/api/node))

## Getting Started

Install this module.

```shell
npm install sails-service-payment
```

Then require it in your service.

```javascript
// api/services/PaymentService.js
module.exports = require('sails-service-payment'); // ES5
import PaymentService from 'sails-service-payment'; // ES6
```

That's it, you can create payment instances for your needs in your project.

```javascript
// api/services/PaymentService.js
import PaymentService from 'sails-service-payment';

export default PaymentService('stripe', {
  apiKey: '<STRIPE_API_KEY>'
});

// api/controllers/PaymentController.js
export default {
  checkout: function(req, res) {
    PaymentService
      .checkout({
        amount: req.param('amount'),
        cardNumber: req.param('cardNumber'),
        expMonth: req.param('expMonth'),
        expYear: req.param('expYear'),
        cvv: req.param('cvv')
      })
      .then(res.ok)
      .catch(res.negotiate);
  }
};
```

## API

Each of Payment instances has 3 methods:

### checkout(creditCard, [config])

Create charge from credit card and proceed to settled transaction. Returns Promise.

`creditCard` - Object with credit card information:

  - `creditCard.amount` - Amount of price in cents, for example $10 = 1000;
  - `creditCard.cardNumber` - 16-digit number of credit card;
  - `creditCard.cardHolderName` - Full name of card holder
  - `creditCard.expMonth` - Expiration date (month);
  - `creditCard.expYear` - Expiration date (year);
  - `creditCard.cvv` - CVV code (3-digit)

`config` - Additional configuration for specific payment systems. See appropriate documentation for payment system.

### retrieve(transactionId)

Retrieve information about settled transaction. Returns Promise.

`transactionId` - ID of transaction that you got from `checkout` result.

### refund(transactionId)

Refund already settled transaction. Returns Promise.

`transactionId` - ID of settled transaction. You can get it from `checkout` result.

## Examples

### BrainTreePayment

```javascript
let brainTree = PaymentService('braintree', {
  sandbox: true, // Set to false if you're going to live
  merchantId: '', // Your credentials from BrainTree dashboard
  publicKey: '', // Your credentials from BrainTree dashboard
  privateKey: '' // Your credentials from BrainTree dashboard
});

brainTree
  .checkout({
    amount: 100 * 10, // $10
    cardNumber: '4242424242424242',
    cardHolderName: 'Eugene Obrezkov',
    expMonth: '01',
    expYear: '2018',
    cvv: '123'
  })
  .then(console.log.bind(console))
  .catch(console.error.bind(console));
```

### StripePayment

```javascript
let stripe = PaymentService('stripe', {
  apiKey: '<API_KEY>'
});

stripe
  .checkout({
    amount: 100 * 10, // How much money to charge in cents
    cardNumber: '4242424242424242', // Card Number (16-digit)
    cardHolderName: 'Eugene Obrezkov', // Card Holder Name (optional)
    expMonth: '01', // Expiration Date (Month)
    expYear: '2018', // Expiration Date (Year)
    cvv: '123' // CVV Code (optional, but highly recommend)
  })
  .then(console.log.bind(console))
  .catch(console.error.bind(console));
```

### Retrieve transaction info on any payment system

```javascript
let stripe = PaymentService('stripe', {
  apiKey: '<API_KEY>'
});

stripe
  .checkout({
    amount: 100 * 10,
    cardNumber: '4242424242424242',
    expMonth: '01',
    expYear: '2018',
    cvv: '123'
  })
  .then(function(result) {
    return stripe.retrieve(result.id);
  })
  .then(console.log.bind(console));
  .catch(console.error.bind(console));
```

### Refund on any payment system

```javascript
let stripe = PaymentService('stripe', {
  apiKey: '<API_KEY>'
});

stripe
  .checkout({
    amount: 100 * 10,
    cardNumber: '4242424242424242',
    expMonth: '01',
    expYear: '2018',
    cvv: '123'
  })
  .then(function(result) {
    return stripe.refund(result.id);
  })
  .then(console.log.bind(console));
  .catch(console.error.bind(console));
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
