console.log('js sourced');
var myApp = angular.module('myApp',[]);

myApp.controller('testController',['$scope','$http',function($scope,$http){
  console.log('NG');
  $scope.search = function(searchIn){
    console.log('serchIn',searchIn);
    //compile url based on search fields filled out actor&director&ect.
    var omdbUrl = 'http://www.omdbapi.com/?t='+searchIn+'&r=json';
    var flixUrl = 'http://netflixroulette.net/api/api.php?actor='+searchIn+'%20';
    $http({
      method:'GET',
      url:flixUrl,
    }).then(function(flixData){
        compareMovies(flixData);
    });//end http.then function
    function compareMovies(dataIn){
      var results = dataIn.data;
      console.log('data',results);
      $scope.dataBack=results;

      for (var i = 0; i < results.length; i++) {
        console.log('results.show_title',results[i].show_title);
        omdbUrl = 'http://www.omdbapi.com/?t='+results[i].show_title+'&r=json';
        $http({
          method:'GET',
          url:omdbUrl
        }).then(function(omdbData){
          console.log('omdbData',omdbData);
          // $scope.omdbDataBack=omdbData;
        });//end http.then function
      }//for loop

    }//compareMovies
  };//scope.searchIn
}]);//myApp.testController
