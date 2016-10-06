var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var pg = require('pg');
var connectionString = 'postgress://localhost:5432/solo';

var port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.listen(port, function(){
  console.log('listening on', port);
});
app.get('/', function(req,res){
  res.sendFile(path.resolve('public/views/index.html'));
});//app.get

app.post('/library',function(req,res){
  console.log('/library post call hit');
  console.log('req.body',req.body);
  pg.connect(connectionString, function(err,client,done){
    if(err){
      console.log(err);
    }else {
      client.query('INSERT INTO movies (title) VALUES ($1)',[req.body.title]);
      res.sendStatus(201);
    }
  });//pg.connect function
});//library post call
app.post('/user',function(req,res){

});//user post call

app.get('/library', function(req,res){

});//library get call

app.use(express.static('public'));
