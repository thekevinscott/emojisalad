'use strict';
function getRandomPhone(index) {
  return '+155546'+Math.floor(10000 + Math.random() * 90000);
}

module.exports = getRandomPhone;
