console.log('js sourced');

var myApp = angular.module('myApp',[]);
var lock = new Auth0Lock('PLvMpMQ4IPOQ8Xl7AHpxYHTFXq9Nt1Or','mattcllhn.auth0.com');
var logoutUrl = 'https://mattcllhn.auth0.com/v2/logout';
//search > hit flix & omdb apis, append to global arrays
//filter info > build userArray based on input conditionals
//display info > anuglar whatever- could be put into display or whatever
myApp.controller('testController',['$scope','$http','$window',function($scope,$http,$window){
// ------------------------------------------------------------------------------------- auth0
$scope.init = function(){
  if(JSON.parse(localStorage.getItem('userProfile'))){
    $scope.userProfile = JSON.parse(localStorage.getItem('userProfile'));
    console.log('logged in',$scope.userProfile);
    $scope.showUser = true;

  }else {
    $scope.showUser = false;
    emptyLocalStorage();
    console.log('in the else of the init function');
  }
};//scope.init
$scope.logIn = function(){
  console.log('button click works');
lock.show(function(err,profile,token){
  if(err){
    console.log(err);
  }else {
    console.log('success!',profile);
    localStorage.setItem('userToken',token);
    localStorage.setItem('userProfile',JSON.stringify(profile));
    location.reload();
  }//else
});//lock.show
};//logIn
$scope.logOut = function(){
  $http({
    method:'Get',
    url: logoutUrl,
  }).then(function(data){
    if(data.data=='OK'){
      emptyLocalStorage();
      $scope.showUser=false;
      location.reload();
    }
  });//http callback function
};//scope.logout
$scope.init();

// ------------------------------------------------------------------------------------- auth0
console.log('NG');
/// get me later
//sanitize inputs >marshall & format variables, clear inputs
$scope.sanitizeInputs = function(actorIn,directorIn,ratingIn){
  // console.log('raw inputs',actorIn, directorIn,ratingIn);
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
      // console.log('formatted inputs ',actor,director, rating);
      //clear inputs
      $scope.actorIn = undefined;
      $scope.directorIn= undefined;
      $scope.ratingIn= undefined;
      //call search function
      urlBuilder(actor,director,rating);
    };//sanitizeInputs

    //search flix api and loop through results hitting omdb api using title of each result
    var  urlBuilder = function(factor,fdirector,frating){
      // console.log(typeof factor);
      var omdbUrl = 'https://www.omdbapi.com/?t='+'&r=json';
      var flixUrl = 'https://netflixroulette.net/api/api.php';
      var compiledParams = '';
      // console.log('in search function',factor,fdirector,frating);
      //conditionals to build compiledParams
      if (factor=== undefined && fdirector=== undefined){
        console.log('mock blank function call');
        compiledParams = '?actor='+randomName();
        console.log('in the conditional',compiledParams);
        //both filled in
      }
      else if(factor!== undefined && fdirector!== undefined){
        compiledParams+=('?actor='+factor+'&?director='+fdirector);
        console.log('both filled in',compiledParams);
        // flixUrl+=compiledParams;
        // userFlix(flixUrl);
      }
      //blank actor
      else if (factor=== undefined && fdirector!== undefined){
        compiledParams+=('?director='+fdirector);
        console.log('director filled in',compiledParams);
        // flixUrl+=compiledParams;
        // userFlix(flixUrl);
      }
      //blank director
      else if (factor!== undefined && fdirector=== undefined) {
        compiledParams+=('?actor='+factor);
        console.log('actor filled in',compiledParams);

      }

      flixUrl+=compiledParams;
      userFlix(flixUrl);

    };//search function
    function userFlix(search){
      var flixArray = [];
      $http({
        method:'GET',
        url:search,
      }).then(function(flixData){
        console.log(flixData);
        flixArray=flixData.data;
        console.log('flixArray',flixArray);
        omdbSearcher(flixArray,false);
      });//end http.then function
    }//userFlix



      function omdbSearcher(dataIn,lib){
        var omdbArray = [];
        $scope.libStatus = lib;

        console.log('omdbsearcher called');
        // console.log('data',results);
        // $scope.dataBack=results;
        for (var i = 0; i < dataIn.length; i++) {
          // console.log('above http call and index of for loop is',i);
          if(dataIn[i].show_title!==undefined){
            omdbUrl = 'https://www.omdbapi.com/?t='+dataIn[i].show_title+'&r=json';
          }else{
            omdbUrl = 'https://www.omdbapi.com/?t='+dataIn[i].title+'&r=json';
          }
          //hits omdb api in for loop
          $http({
            method:'GET',
            url:omdbUrl
          }).then(function(omdbData){
            // console.log('index of omdbData',omdbData.data);
            if( omdbData.data.Poster !== undefined && omdbData.data.Poster !== 'N/A' ) {
              console.log('poster here----->',omdbData.data.poster);
            omdbArray.push(omdbData.data);
          }
            // console.log('omdbData',omdbData);
          });//end http.then function
        }//for loop
        console.log('omdbArray',omdbArray);
        $scope.seeMovies = omdbArray;
      }//compareMovies
      $scope.librarySearcher = function(client) {
        console.log('hello from librarySearcher client id is:',client);
        var objectToSend = {
          client:client
        };
        $http({
          method:"PUT",
          url:"/library",
          data:objectToSend
        }).then(function(libArray){
          console.log('libArray',libArray);
          var movies = libArray.data;
          omdbSearcher(movies, true);
        });//http call
      };//librarysearcher
      function randomName(){
        var nameArray = ['smith','johnson','williams','jones','brown','davis','miller','wilson','moore','taylor'];
        console.log('random number',Math.round(Math.random()*10));
      var randomName = nameArray[Math.round(Math.random()*10)];
      return randomName;
    }//randomName
    $scope.saveMovie = function(title,client){
      console.log('saving '+title+' to DB for client id:'+client);
      var thingToSend = {
        title:title,
        client:client
      };//thingToSend
      $http({
        method:'POST',
        url:'/library',
        data:thingToSend
      }).then(function(data){
        console.log('status=',data);
      });//http.then function
    };//scope.save
    $scope.redirect = function(title){
      console.log(title+' clicked');
      var uri = encodeURIComponent(title).replace(/%20/g,'%2520');
      $window.open('https://www.netflix.com/search/'+uri);
    };//redirectTester
  }]);//myApp.testController
  var emptyLocalStorage = function(){
localStorage.removeItem('userProfile');
localStorage.removeItem('userToken');
};//emptyLocalStorage
