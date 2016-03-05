'use strict';

const game_numbers = [
  '+15551111111',
  '+15552222222',
  '+15553333333',
  '+15554444444',
  '+15559999999',
];

module.exports = game_numbers;
module.exports.getDefault = function() {
  return game_numbers[0];
};
