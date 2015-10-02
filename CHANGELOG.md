# Changelog

## 3.0.3

- General improvements;

## 3.0.2

- Fix `refund` method for new Stripe version;

## 3.0.1

- Typo fixes in docs;

## 3.0.0

- Migration from ES5 syntax to ES6;
- Remove `.create` method from PaymentService. PaymentService is a function now that you can call with `PaymentService('stripe', {})`;

## 2.0.0

- Replace `getConfig` and `setConfig` with `get` and `set` methods;
- Implement `retrieve` method that allows to get info about settled transaction;
- Optimize `PaymentService.create` method;
- Improve test coverage;
- Update docs;

## 1.2.0

- Implement adding specific provider options in checkout and refund methods;

## 1.1.0

- Add `refund` feature to interface and implement it for BrainTree and Stripe;

## 1.0.0

- Add support for BrainTreePayments;
- Add support for Stripe;

## 0.1.0

- Initial release;
