'use strict';
function getRandomPhone(index) {
  if ( index !== null ) {
    return '+186046'+index+index+index+index+index;
  } else {
    return '+186046'+Math.floor(10000 + Math.random() * 90000);
  }
}

module.exports = getRandomPhone;
