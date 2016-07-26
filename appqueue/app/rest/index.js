export default function bootstrapREST(app) {
  //const receive = require('./receive');

  //app.get('/received', require('./received'));
  //app.get('/senders', require('./rest/senders'));
  //app.get('/senders/:sender', require('./restsenders').getSenderID);
  app.get('/', (req, res) => {
    res.send('app queue root');
  });
  app.get('*', (req, res) => {
    console.error('unknown error requested', req.url);
  });
  //app.post('/claim', require('./claim'));
  //app.get('/games', require('./games'));
  app.get('/test', (req, res) => {
    res.json({ foo: 'bar' });
  });
}
