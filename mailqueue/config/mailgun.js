'use strict';

const domains = {
  production: {},
  sandbox: {
    apiKey: 'key-e0021a0af069c6d2fba29aa4909afb2a',
    //domain: 'mg.emojinaryfriend.com'
    domain: 'sandboxffe8ba4cf31144e79c809c7d8f3f499f.mailgun.org'
  }
};

module.exports = domains.sandbox;
