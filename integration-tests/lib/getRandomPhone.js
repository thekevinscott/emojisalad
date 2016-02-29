'use strict';
const phones = {};
function getRandomPhone(index) {
  const random_phone = '+155546'+Math.floor(10000 + Math.random() * 90000);
  if ( !phones[random_phone] ) {
    phones[random_phone] = true;
    return random_phone;
  } else {
    return getRandomPhone(index);
  }
}

module.exports = getRandomPhone;
