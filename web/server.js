const express = require('express');
const app = express();
const capturePhone = require('./server/capturePhone');

app.set('port', (process.env.PORT || 5002));

const bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.static(__dirname + '/'));

// views is directory for all template files
app.set('views', __dirname + '/');
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/submit', capturePhone);

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
