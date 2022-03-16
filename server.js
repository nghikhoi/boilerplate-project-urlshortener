require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

const isURLValid = (url) => {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(url);
}

const urlMap = new Map()

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get("/api/shorturl/:id?", (req, res) => {
  var id = req.params.id;
  if (!id || !urlMap.has(id)) {
    res.json({
      error: 'invalid url'
    })
    return
  }
  
  var desc = urlMap.get(id)
  res.redirect(desc)
})

app.post("/api/shorturl", (req, res) => {
  var url = req.body['url']

  if (!isURLValid(url)) {
    res.json({
      error: 'invalid url'
    })
    return
  }

  var size = urlMap.size + 1
  urlMap.set(size.toString(), url)

  res.json({
    original_url: url,
    short_url: size
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
