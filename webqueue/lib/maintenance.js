const Promise = require('bluebird');
const twilio = require('twilio');
const config = require('config/twilio');
const client = twilio(config.accountSid, config.authToken);
const sendMessage = Promise.promisify(client.sendMessage);

const downForMaintenance = (req, res) => {
  const params = req.body;
  const data = {
    body: params.body || params.Body,
    to: params.to || params.To,
    from: params.from || params.From
  };

  sendMessage({
    from: data.to,
    to: data.from,
    body: 'Emojinary is currently down for some short maintenance. Please reach out to Ari (412-638-2398), Kevin (860-460-8183), or Michelle (415-297-5657) for more info.'
  });
};

module.exports = downForMaintenance;
