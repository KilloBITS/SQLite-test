const express = require('express');
const path = require('path');
const bParser = require('body-parser');
const open = require('open');
const app = express();

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(bParser.urlencoded({limit: '50mb'}));
app.use(bParser.json());
app.use(allowCrossDomain);
app.use(express.static(path.join(__dirname, '../build')));


app.get('/*', function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const getData =  require('./controllers/getData-controller');
app.post('/getData', getData);
app.post('/setData', getData);

app.listen(3001, function(){
  open('http://localhost:3001/');
  console.warn('Server started from port 3001');
});
