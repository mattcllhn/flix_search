var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended:true}));

app.listen(port, function(){
  console.log('listening on', port);
});
app.get('/', function(req,res){
  res.sendFile(path.resolve('public/views/index.html'));
});//app.get

app.use(express.static('public'));
