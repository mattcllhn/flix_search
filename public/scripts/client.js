console.log('js sourced');
var myApp = angular.module('myApp',[]);

myApp.controller('testController',['$scope','$http',function($scope,$http){
  console.log('NG');
  $scope.search = function(searchIn){
    console.log('serchIn',searchIn);
    var urlIn = 'http://www.omdbapi.com/?t='+searchIn+'&r=json';
    $http({
      method:'GET',
      url:urlIn,
    }).then(function(data){
      $scope.dataBack = data;

    });//end http.then function

  };
}]);//myApp.testController
