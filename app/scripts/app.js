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
    'brightwork'
  ])
  .constant('$apiConfig', {
    apiKey: '1970e53aad964fe3bba3b3d3b1b7c3c7',
    appName:'brighttube',
    apiUrl: 'http://api.brightwork.dev',
    appUrl: 'http://brighttube.brightwork.dev:8000'
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
  }]);

