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
      // console.log('req.body.title',req.body.title);
      var title = req.body.title;
      var resultsArray = [];
      // console.log('SELECT id FROM movies WHERE title = $1',[title]);
      var queryResults = client.query('SELECT id FROM movies WHERE title = $1',[title]);
        queryResults.on('row',function(row){
          resultsArray.push(row);
        });//on row function
        queryResults.on('end',function(){
          // console.log('resultsArray',resultsArray);

        if(resultsArray.length>0){
          console.log('selected movie already exists',resultsArray.length);
      client.query('INSERT INTO favorites (user_id,movie_id) VALUES ($1,$2)',[req.body.client,resultsArray[0].id]);
      done();
      res.sendStatus(201);
    }else {
      var query = client.query('INSERT INTO movies (title) VALUES ($1)',[req.body.title]);
      var queryResults1 = client.query('SELECT id FROM movies WHERE title = $1',[req.body.title]);
      queryResults1.on('row',function(row){
        resultsArray.push(row);
      });
      queryResults1.on('end',function(){
        client.query('INSERT INTO favorites (user_id,movie_id) VALUES ($1,$2)',[req.body.client,resultsArray[0].id]);
        console.log('selected movies does not yet exist');
        done();
        res.sendStatus(200);
      });
    }//nested else
  });//on end function


  }//first else
  });//pg.connect function
});//library post call
app.post('/user',function(req,res){

});//user post call

app.put('/library', function(req,res){
console.log('/library hit');
console.log('req.body',req.body);

  pg.connect(connectionString,function(err,client,done){
    if (err){
      console.log(error);
    }else {
        var resultsArray = [];
        var queryResults = client.query('SELECT title FROM movies RIGHT JOIN favorites ON movie_id = id WHERE favorites.user_id = $1',[req.body.client]);
          queryResults.on('row',function(row){
            resultsArray.push(row);
          });//on row function
          queryResults.on('end',function(){
            console.log('resultsArray------------------->',resultsArray);
            // var secondArray = [];
            //
            // var secondqueryResults = client.query('SELECT title FROM movies WHERE id = $1',[resultsArray[i]]);
            //   secondqueryResults.on('row',function(row){
            //   secondArray.push(row);

            done();
            return res.send(resultsArray);
          // });//on row function
          });//on end function
    }//else
  });//pg.connect
});//library get call

app.use(express.static('public'));
