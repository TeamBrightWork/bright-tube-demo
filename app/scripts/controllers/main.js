'use strict';

/**
 * @ngdoc function
 * @name bwTubeDemoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bwTubeDemoApp
 */
angular.module('bwTubeDemoApp')
  .controller('VideoCtrl', ['$scope', '$sce', '$timeout', '$bw', '$apiConfig' , function ($scope, $sce, $timeout, $bw, $apiConfig) {

    var controller = this;
    controller.state = null;
    controller.API = null;
    controller.currentVideo = 0;
    controller.videos = [];

    $scope.playing = {}

    controller.onPlayerReady = function(API) {
      controller.API = API;
    };

    controller.onCompleteVideo = function() {
      controller.isCompleted = true;

      controller.currentVideo++;

      if (controller.currentVideo >= controller.videos.length) controller.currentVideo = 0;

      controller.setVideo(controller.currentVideo);
      $scope.videos.shift();
    };

    controller.getVideos = function() {

      // TODO: enable database video lookup
      $bw.models.video.find().then(function(videos) {
        console.log(videos);

        controller.videos = [];

        videos.forEach(function(video){

          controller.videos.push({
            sources:[
              {
                src: $sce.trustAsResourceUrl(video.url + '?apikey=' + $apiConfig.apiKey),
                type: video.type,
                name: video.name,
                tags: video.tags.map(function(item){
                  return item.name;
                })
              },
            ]
          });

        });
        console.log(controller.videos);
        $scope.videos = controller.videos;
        $scope.$apply();

        controller.config = {
          preload: "none",
          autoHide: false,
          autoHideTime: 3000,
          autoPlay: false,
          sources: controller.videos[0].sources,
          theme: {
            url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
          }
        };

        controller.setVideo(0);
      });

    };

    controller.getVideos();

    controller.setVideo = function(index) {
      controller.API.stop();
      controller.currentVideo = index;

      controller.config.sources = controller.videos[index].sources;
      $timeout(controller.API.play.bind(controller.API), 100);

      $scope.playing = controller.videos[index].sources[0];

      console.log('***PLAYING***', $scope.playing);
    };

  }]);
