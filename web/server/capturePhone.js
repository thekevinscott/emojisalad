const api = require('../service')('api');
const web = require('../service')('web');

module.exports = (req, res) => {
  const phone = req.body.phone;
  return api('phones', 'parse', null, { phone }).then(response => {
    if (response.error) {
      throw "Your phone number was invalid; please enter something in the form 555-555-5555";
    } else {
      return web('receive', 'receive', { phone: response.phone });
    }
  }).then(response => {
    if (!response || response.error) {
      throw "There was an error inserting your number; please try again later.";
    } else {
      res.json({
        phone: response.phone
      });
    }
  }).catch(error => {
    res.json({
      error
    });
  });

};
