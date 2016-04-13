/* This is for verification with Facebook's Webhook URL.
 *
 * We input a secret token on their admin interface,
 * and then we spit them back the token they give us.
 */
const secret_token = 'Big pile of emoji poo';
module.exports = (req, res) => {
  const verify_token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (verify_token === secret_token) {
    res.send(challenge);
  } else {
    res.send('');
  }
};
