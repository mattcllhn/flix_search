console.log('js sourced');
var omdbArray = [];
var flixArray = [];
var userArray = [];

var myApp = angular.module('myApp',[]);
//search > hit flix & omdb apis, append to arrays
//filter info > build userArray based on input conditionals
//display info > anular whatever- could be put into display or whatever
myApp.controller('testController',['$scope','$http',function($scope,$http){
  console.log('NG');
  //sanitize inputs >marshall & format variables, clear inputs

  $scope.sanitizeInputs = function(){
    //format inputs
    //conditionals
    //call search function
  };//sanitizeInputs
  $scope.search = function(actorIn,ratingIn){

    var flixUrl = 'http://netflixroulette.net/api/api.php?actor='+actor;
    console.log('flixUrl',flixUrl);

    //---------------------------------------------->compile url based on search fields filled out actor&director&ect.
    var omdbUrl = 'http://www.omdbapi.com/?t='+actor+'&r=json';
    $http({
      method:'GET',
      url:flixUrl,
    }).then(function(flixData){
        compareMovies(flixData);
        flixArray = flixData.data;
        console.log('flixArray',flixArray);
    });//end http.then function
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
  };//scope.actorIn
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
