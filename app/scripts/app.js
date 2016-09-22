'use strict';

/**
 * @ngdoc overview
 * @name bwTubeDemoApp
 * @description
 * # bwTubeDemoApp
 *
 * Main module of the application.
 */
angular
  .module('bwTubeDemoApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angularFileUpload',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.poster',
    'com.2fdevs.videogular.plugins.buffering',
    'autocomplete',
    'ngLodash',
    'brightwork'
  ])
  .constant('$apiConfig', {
    apiKey: 'a78f0322b3dc4a3cbb50f320bee3f55f',
    appName:'brighttube',
    apiUrl: 'http://api.brightwork.io',
    appUrl: 'http://brighttube.bwapps.io'
  })
  .config(function ($routeProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'VideoCtrl',
        controllerAs: 'player',
        resolve: {
          '$bw' : ['$bw', function($bw) {
            return $bw.init();
          }]
        }
      })
      .when('/upload', {
        templateUrl: 'views/upload.html',
        controller: 'UploadCtrl',
        controllerAs: 'UploadCtrl',
        resolve: {
          '$bw' : ['$bw', function($bw) {
            return $bw.init();
          }]
        }
      })
      .otherwise({
        redirectTo: '/'
      });

  })
  .config(['$bwProvider', '$apiConfig', function($bw, $apiConfig){
    $bw.apiKey($apiConfig.apiKey);
    $bw.appName($apiConfig.appName);
    $bw.apiUrl($apiConfig.apiUrl);
    $bw.appUrl($apiConfig.appUrl);
  }])
  .run(['$rootScope', '$location', function($rootScope, $location){
    $rootScope.go = function(route) {
      console.log('GO', route);
      $location.path(route);
    }
  }]);

