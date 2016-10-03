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
      console.log('data',dataIn.data);
      $scope.dataBack=dataIn.data;

      for (var i = 0; i < dataIn.length; i++) {

      }//for loop

    }//compareMovies
  };//scope.searchIn
}]);//myApp.testController
