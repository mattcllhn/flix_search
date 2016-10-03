console.log('js sourced');
var omdbArray = [];
var flixArray = [];

var myApp = angular.module('myApp',[]);

myApp.controller('testController',['$scope','$http',function($scope,$http){
  console.log('NG');
  $scope.search = function(searchIn){
    console.log('searchIn',searchIn);
    //compile url based on search fields filled out actor&director&ect.
    var omdbUrl = 'http://www.omdbapi.com/?t='+searchIn+'&r=json';
    var flixUrl = 'http://netflixroulette.net/api/api.php?actor='+searchIn+'%20';
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
        omdbUrl = 'http://www.omdbapi.com/?t='+results[i].show_title+'&r=json';
        $http({
          method:'GET',
          url:omdbUrl

          //----------------------------------maybe need to break this up because it's async -->getting errors in larger calls
        }).then(function(omdbData){
          // console.log('omdbData',omdbData);
          if(Number(omdbData.data.imdbRating)<8){
            console.log(omdbData.data.Title+' is not good enough');
          }else{
            console.log(omdbData.data.Title + ' is good enough');

          omdbArray.push(omdbData.data);
        }
          // $scope.omdbDataBack=omdbData;

        });//end http.then function
      }//for loop
      console.log('omdbArray',omdbArray);

    }//compareMovies
  };//scope.searchIn
  $scope.display = function(){
    $scope.seeMovies = omdbArray;
  };
  $scope.display();
}]);//myApp.testController
