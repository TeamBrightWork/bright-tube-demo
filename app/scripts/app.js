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
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.poster',
    'com.2fdevs.videogular.plugins.buffering',
    'brightwork'
  ])
  .config(function ($routeProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        resolve: {
          '$bw' : ['$bw', function($bw) {
            return $bw.init();
          }]
        }
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });

  })
  .config(['$bwProvider', function($bw){
    $bw.apiKey('51553aaae4b340db9facd6717590570d');
    $bw.appName('brighttube');
  }]);

