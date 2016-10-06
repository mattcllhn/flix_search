console.log('js sourced');
var omdbArray = [];
var flixArray = [];
var userArray = [];
var myApp = angular.module('myApp',[]);
//search > hit flix & omdb apis, append to global arrays
//filter info > build userArray based on input conditionals
//display info > anuglar whatever- could be put into display or whatever
myApp.controller('testController',['$scope','$http',function($scope,$http){
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
        var omdbUrl = 'http://www.omdbapi.com/?t='+'&r=json';
        var flixUrl = 'http://netflixroulette.net/api/api.php';
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
          // flixUrl+=compiledParams;
          // userFlix(flixUrl);
        }

        flixUrl+=compiledParams;
        userFlix(flixUrl);


        // both blank
        // console.log(compiledParams);
        //add compiledParams to flixUrl
        // flixUrl+=compiledParams;
        // userFlix(flixUrl);
        //hits flix api
      };//search function
      function userFlix(search){
        $http({
          method:'GET',
          url:search,
        }).then(function(flixData){
          console.log(flixData);
          flixArray=flixData.data;
          console.log('flixArray',flixArray);
          omdbSearcher(flixArray);
        });//end http.then function
      }//userFlix



        function omdbSearcher(dataIn){
          console.log('omdbsearcher called');
          omdbArray = [];
          // console.log('data',results);
          // $scope.dataBack=results;
          for (var i = 0; i < dataIn.length; i++) {
            // console.log('above http call and index of for loop is',i);
            omdbUrl = 'http://www.omdbapi.com/?t='+dataIn[i].show_title+'&r=json';
            //hits omdb api in for loop
            $http({
              method:'GET',
              url:omdbUrl
            }).then(function(omdbData){
              // console.log('index of omdbData',omdbData.data);
              omdbArray.push(omdbData.data);
              // console.log('omdbData',omdbData);
            });//end http.then function
          }//for loop
          console.log('omdbArray',omdbArray);
          $scope.seeMovies = omdbArray;
        }//compareMovies
        function randomName(){
          var nameArray = ['smith','johnson','williams','jones','brown','davis','miller','wilson','moore','taylor'];
          console.log('random number',Math.round(Math.random()*10));
        var randomName = nameArray[Math.round(Math.random()*10)];
        return randomName;
      }//randomName
      $scope.modal = function(data){
        console.log(data+' clicked');
      };
      $scope.save = function(data){
        console.log('saving '+data+' to DB');
        var thingToSend = {
          title:data
        };

        $http({
          method:'POST',
          url:'/library',
          data:thingToSend
        }).then(function(data){
          console.log('status=',data);
        });//http.then function

      };//scope.save
    }]);//myApp.testController
