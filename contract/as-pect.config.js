const config = require('@antchain/myfish-asp-config');

module.exports = {
  ...config,
  add: ['contract/assembly/**/*.include.ts'],
  include: ['contract/assembly/**/*.spec.ts'],
};
