'use strict';
function getRandomScore() {
  return Math.round(Math.random()*1000) - 500;
}

module.exports = getRandomScore;
