console.log('js sourced');
var omdbArray = [];
var flixArray = [];
var userArray = [];
var blobjectToSend = [];
var myApp = angular.module('myApp',[]);
//search > hit flix & omdb apis, append to global arrays
//filter info > build userArray based on input conditionals
//display info > anuglar whatever- could be put into display or whatever
myApp.controller('testController',['$scope','$http',function($scope,$http){
  console.log('NG');
  //sanitize inputs >marshall & format variables, clear inputs
  $scope.sanitizeInputs = function(actorIn,directorIn,ratingIn,awardIn){
    console.log('raw inputs',actorIn, directorIn,ratingIn,awardIn);
    //set minimum input length
    if( actorIn!==undefined && actorIn.length<3 || directorIn!==undefined && directorIn.length<3 ){
      alert('Seach fields must be greater than 3 characters');
      location.reload();
    // }else if (actorIn.toLowerCase()=='chuck norris') {
    //   confirm('Warning! You just searched for Chuck Norris!! Are you sure you want to continue?');
    //   if(false){
    //     location.reload();
    //   }
    }
    //marshall local variables
    var actor;
    var director;
    if (actorIn!== undefined){
       actor = encodeURI(actorIn);
    }else{
       actor = undefined;}
    if (directorIn!== undefined){
       director = encodeURI(directorIn);
    }else{
       director = undefined;}
    var rating = Number(ratingIn);
    var award = false;
    if(awardIn == 'yes'){
      award = true;
    }else{
      award = false;
    }
    // hack to add characters to search function becuase flix api requires more than 5 characters
    if(actor !==undefined && actor.length<5){
      actor+='%20';
    }
    if(director !==undefined && director.length<5){
      director+='%20';
    }
    if (isNaN(rating)===true) {
      rating = 0;

    }
    // console.log('formatted inputs ',actor,director, rating, award);
    //clear inputs
    $scope.actorIn = undefined;
    $scope.directorIn= undefined;
    $scope.ratingIn= undefined;
    $scope.awardIn= undefined;
    //call search function
    search(actor,director,rating,award);
  };//sanitizeInputs

//search flix api and loop through results hitting omdb api using title of each result
var  search = function(factor,fdirector,frating,faward){
    console.log(typeof factor);
    var omdbUrl = 'http://www.omdbapi.com/?t='+'&r=json';
    var flixUrl = 'http://netflixroulette.net/api/api.php';
    var compiledParams = '';
console.log('in search function',factor,fdirector,frating,faward);
    //conditionals to build compiledParams
    //both filled in
  if(factor!== undefined && fdirector!== undefined){
    // console.log('both filled in');
    compiledParams+=('?actor='+factor+'&?director='+fdirector);
  }
  //blank actor
else if (factor=== undefined && fdirector!== undefined){
  // console.log('director filled in');
  compiledParams+=('?director='+fdirector);
}
//blank director
else if (factor!== undefined && fdirector=== undefined) {
  // console.log('actor filled in');
  compiledParams+=('?actor='+factor);
}
  //both blank
  // else if (factor=== undefined && fdirector=== undefined){
  //----------------------------------------------------------------->loop with actor = blobjectToSend
  // }
    console.log(compiledParams);
    //add compiledParams to flixUrl
      flixUrl+=compiledParams;
    console.log('flixUrl',flixUrl);

    //hits flix api
    $http({
      method:'GET',
      url:flixUrl,
    }).then(function(flixData){
        flixArray = flixData.data;
        console.log('flixArray',flixArray);
        compareMovies(flixArray);

    });//end http.then function
    function compareMovies(dataIn){
      omdbArray = [];
      var results = dataIn;
      // console.log('data',results);
      // $scope.dataBack=results;
      for (var i = 0; i < results.length; i++) {
        console.log('above http call and index of for loop is',i);
        omdbUrl = 'http://www.omdbapi.com/?t='+results[i].show_title+'&r=json';
        //hits omdb api in for loop
        $http({
          method:'GET',
          url:omdbUrl
        }).then(function(omdbData){
          // console.log('index of omdbData',omdbData.data);
          omdbArray.push(omdbData.data)
          

        });//end http.then function
      }//for loop
      display(frating,faward);

      console.log('omdbArray',omdbArray);
      console.log('omdbArray.length',omdbArray.length);

    }//compareMovies
  };//search function

  //filter omdb array by rating and award status and package in a scoped variable
  var display = function(ratingsIn,awardsIn){
// console.log('display function hit',ratingsIn,awardsIn);
// console.log('omdbArray in display function',omdbArray);
// console.log('omdbArray.length',omdbArray.length);
    for (var i = 0; i < omdbArray.length; i++) {
      console.log('omdb array index',omdbArray[i]);
    }
    // console.log('userArray',userArray);
    $scope.seeMovies = omdbArray;
  };//scope.display function
}]);//myApp.testController
