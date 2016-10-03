console.log('js sourced');
var omdbArray = [];
var flixArray = [];
var clientArray = [];

var myApp = angular.module('myApp',[]);

myApp.controller('testController',['$scope','$http',function($scope,$http){
  console.log('NG');
  $scope.search = function(actorIn){
    //function to verify inputs
    var actor = encodeURI(actorIn);
    console.log('actorIn',actor);

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
        console.log('above http call');
        omdbUrl = 'http://www.omdbapi.com/?t='+results[i].show_title+'&r=json';
        $http({
          method:'GET',
          url:omdbUrl

          //----------------------------------break this up because it's async -->getting errors in larger calls
        }).then(function(omdbData){
          console.log('inside .then ');
          // console.log('omdbData',omdbData);
          // if(Number(omdbData.data.imdbRating)){
            // console.log(omdbData.data.Title+' is not good enough');
          // }else{
            // console.log(omdbData.data.Title + ' is good enough');

          omdbArray.push(omdbData.data);
        // }
          // $scope.omdbDataBack=omdbData;

        });//end http.then function
      }//for loop
      console.log('omdbArray',omdbArray);

    }//compareMovies
  };//scope.actorIn
  $scope.display = function(){

    $scope.seeMovies = omdbArray;
  };
  $scope.display();
}]);//myApp.testController
