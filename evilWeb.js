const express = require('express');
const app = express();
const path = require('path');
const dotenv = require("dotenv");

dotenv.config();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const csrfRouter = require('./routes/csrf');
app.use('/', csrfRouter);

const host = 'localhost';

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? 10005 : 3000;

if(externalUrl) {
  const hostname = '127.0.0.1';
  app.listen(port, hostname, () => {
    console.log(`Server locally running at http://${hostname}:${port}/ and from outside on ${externalUrl}`);
  });
} else {
  app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
  });
}