var express = require('express');
var app = express();
var path = require('path');
var public = path.join(__dirname, 'docs');
app.use('/', express.static(public));
app.get('*', function(req, res){
  res.status(404).sendFile(path.resolve(__dirname, 'docs/404/index.html'));
});

app.listen(8080); 