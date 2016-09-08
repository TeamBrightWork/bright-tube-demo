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
      var videosFromDB;

      // FAKE VIDEO DATA
      // var videosFromDB = [
      //   {
      //     url: "http://static.videogular.com/assets/videos/videogular.mp4",
      //     type: "video/mp4",
      //     name: "Pale Blue Dot"
      //   },
      //   {
      //     url: "http://static.videogular.com/assets/videos/big_buck_bunny_720p_h264.mov",
      //     type: "video/mp4",
      //     name: "Big Buck Bunny"
      //   }
      // ];

      $bw.models.video.find().then(function(videos) {
        console.log(videos);

        videosFromDB = videos;

        controller.videos = [];

        videosFromDB.forEach(function(video){

          video = {
            sources:[
              {src: $sce.trustAsResourceUrl(video.url + '?apikey=' + $apiConfig.apiKey), type: video.type, name: video.name},
            ]
          };

          controller.videos.push(video);

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
      });
    };

    controller.getVideos();

    controller.setVideo = function(index) {
      controller.API.stop();
      controller.currentVideo = index;
      controller.config.sources = controller.videos[index].sources;
      $timeout(controller.API.play.bind(controller.API), 100);
    };

  }]);
