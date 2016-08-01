import received from './received';
import send from './send';

export default function routes(app) {
  app.get('/', (req, res) => {
    res.send('app queue root');
  });
  app.get('/received', received);
  app.post('/send', send);
  //app.post('/claim', require('./claim'));
  //app.get('/games', require('./games'));
  app.get('/test', (req, res) => {
    res.json({ foo: 'bar' });
  });
  app.get('*', (req, res) => {
    console.error('unknown error requested', req.url);
    res.end();
  });
}
