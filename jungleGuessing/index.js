const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(`${__dirname}/dist`));

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/index.html`));
});

app.listen(port, () => {
  console.log(`Jungle is running on ${port}`);
});
