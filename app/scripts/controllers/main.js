'use strict';

/**
 * @ngdoc function
 * @name bwTubeDemoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bwTubeDemoApp
 */
angular.module('bwTubeDemoApp')
  .controller('VideoCtrl', ['$rootScope', '$scope', '$sce', '$timeout', '$bw', '$apiConfig', 'lodash', function ($rootScope, $scope, $sce, $timeout, $bw, $apiConfig, lodash) {

    var controller = this;
    controller.state = null;
    controller.API = null;
    controller.currentVideo = 0;
    controller.videos = [];

    $scope.playing = {};

    controller.onPlayerReady = function(API) {
      controller.API = API;
    };

    controller.onCompleteVideo = function() {
      controller.isCompleted = true;

      controller.currentVideo++;

      if (controller.currentVideo >= controller.videos.length) {
        controller.currentVideo = 0;
      }

      controller.setVideo(controller.currentVideo);
      $scope.videos.shift();
    };

    controller.setVideo = function(index) {
      controller.API.stop();
      controller.currentVideo = index;

      controller.config.sources = controller.videos[index].sources;
      $timeout(controller.API.play.bind(controller.API), 100);

      $scope.playing = controller.videos[index].sources[0];
    };

    var mapVideos = function(results) {
      return results.then(function (videos) {

        controller.videos = lodash.map(videos, function (video) {
          return {
            sources: [
              {
                src: $sce.trustAsResourceUrl(video.url + '?apikey=' + $apiConfig.apiKey),
                type: video.type,
                name: video.name,
                tags: lodash.map(video.tags, 'name')
              }
            ]
          };
        });

        $scope.videos = controller.videos;
        $scope.$apply();

        controller.config = {
          preload: 'none',
          autoHide: false,
          autoHideTime: 3000,
          autoPlay: false,
          sources: controller.videos[0].sources,
          theme: {
            url: 'http://www.videogular.com/styles/themes/default/latest/videogular.css'
          }
        };

        controller.setVideo(0);
      });
    };

    // TODO: (1) enable database video lookup
    mapVideos($bw.models.video.find());

    $rootScope.search = function() {
      var query = $bw.query().equalTo('name', $rootScope.searchText);

      mapVideos($bw.models.tag.find(query).then(function(tags){
        console.log(tags);
        return tags[0].videos;
      }));
    };


    $bw.models.tag.find().then(function(tags){
      $rootScope.searchTags = lodash.map(tags, 'name');
    });


  }]);
