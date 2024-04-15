require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let urls = [];
let counter = 1;

app.post('/api/shorturl', function (req, res) {
  const originalUrl = req.body.url;
  const shortUrl = counter++;

  urls.push({ original_url: originalUrl, short_url: shortUrl });
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

app.get('/api/shorturl/:shortUrl', function (req, res) {
  const shortUrl = parseInt(req.params.shortUrl);
  const foundUrl = urls.find(url => url.short_url === shortUrl);

  if (foundUrl) {
    res.redirect(foundUrl.original_url);
  } else {
    res.json({ error: 'invalid url' });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});