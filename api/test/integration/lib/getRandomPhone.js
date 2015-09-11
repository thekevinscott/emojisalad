function getRandomPhone() {
  return '+186046'+Math.floor(10000 + Math.random() * 90000);
}

module.exports = getRandomPhone;
