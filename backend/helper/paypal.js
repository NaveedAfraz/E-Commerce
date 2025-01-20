const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AWYcNeUOcj38ofvI62bJg-PfGPUSw74ITS5RsUQnHqBlwNJINoj6nl6uEqFhQbl0KxJXjRn1ylrU4lkj",
  client_secret: "EOTWoA7v5F90r3lUmb45CrT3vKdUqU7Kh-im8FSGJAL1cc_9gw-AcQqW-0ftUL0YGRCrUVlOCKKaNiou",
});

module.exports = paypal;