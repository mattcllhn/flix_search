console.log('js sourced');
var omdbArray = [];
var flixArray = [];
var userArray = [];
var blobjectToSend = [];
var myApp = angular.module('myApp',[]);
//search > hit flix & omdb apis, append to global arrays
//filter info > build userArray based on input conditionals
//display info > anular whatever- could be put into display or whatever
myApp.controller('testController',['$scope','$http',function($scope,$http){
  console.log('NG');
  //sanitize inputs >marshall & format variables, clear inputs

  $scope.sanitizeInputs = function(actorIn,directorIn,ratingIn,awardIn){
    //format inputs
    console.log('raw inputs',actorIn, directorIn,ratingIn,awardIn);
    //set minimum length
    if( actorIn!==undefined && actorIn.length<3 || directorIn!==undefined && directorIn.length<3 ){
      alert('Seach fields must be greater than 3 characters');
      location.reload();
    }
    var actor = encodeURI(actorIn);
    var director = encodeURI(directorIn);
    var rating = Number(ratingIn);
    var award = false;
    //conditionals
    if(awardIn == 'yes'){
      award = true;
    }else{
      award = false;
    }
    // hack to add characters to search function becuase flix api requires more than 5 characters
    if(actor.length<5){
      actor+='%20';
    }
    if(director.length<5){
      director+='%20';
    }
    if (rating.isNaN) {
      rating = 0;
    }
    console.log('formatted inputs ',actor,director, rating, award);
    //clear inputs
    // $scope.actorIn = '';
    // $scope.directorIn= '';
    // $scope.ratingIn= '';
    // $scope.awardIn= '';
    //call search function

    search(actor,director,rating,award);
  };//sanitizeInputs
  search = function(actorIn,ratingIn){


    var flixUrl = 'http://netflixroulette.net/api/api.php?actor=';
    console.log('flixUrl',flixUrl);

    //---------------------------------------------->compile url based on search fields filled out actor&director&ect.
    var omdbUrl = 'http://www.omdbapi.com/?t='+'&r=json';
    // $http({
    //   method:'GET',
    //   url:flixUrl,
    // }).then(function(flixData){
    //     compareMovies(flixData);
    //     flixArray = flixData.data;
    //     console.log('flixArray',flixArray);
    // });//end http.then function
    function compareMovies(dataIn){
      omdbArray = [];
      var results = dataIn.data;
      // console.log('data',results);
      $scope.dataBack=results;

      for (var i = 0; i < results.length; i++) {
        // console.log('above http call');
        omdbUrl = 'http://www.omdbapi.com/?t='+results[i].show_title+'&r=json';
        $http({
          method:'GET',
          url:omdbUrl

          //----------------------------------break this up because it's async -->getting errors in larger calls
        }).then(function(omdbData){
          omdbArray.push(omdbData.data);
        });//end http.then function
      }//for loop
      $scope.display(ratingIn);
      console.log('omdbArray',omdbArray);
    }//compareMovies
  };//search function
  $scope.display = function(ratingIn){
    var userRating = Number(ratingIn);
    for (var i = 0; i < omdbArray.length; i++) {
      if (omdbArray[i].imdbRating<userRating) {
        console.log(omdbArray[i].Title +'is not good enough');
      }else{
        userArray.push(omdbArray[i]);
      }//else
    }//for loop
    console.log('userArray',userArray);
    $scope.seeMovies = omdbArray;
  };//scope.display function
}]);//myApp.testController
