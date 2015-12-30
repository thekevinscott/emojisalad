const bot_endpoint = 'http://localhost:5000/';
const services = {
  bot: {
    get hook() {
      return bot_endpoint + 'ping';
    }
  }
};

module.exports = services;
