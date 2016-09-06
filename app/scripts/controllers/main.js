'use strict';

/**
 * @ngdoc function
 * @name bwTubeDemoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bwTubeDemoApp
 */
angular.module('bwTubeDemoApp')
  .controller('VideoCtrl', ['$scope', '$sce', '$timeout', '$bw', function ($scope, $sce, $timeout, $bw) {

    var controller = this;
    controller.state = null;
    controller.API = null;
    controller.currentVideo = 0;

    controller.onPlayerReady = function(API) {
      controller.API = API;
    };

    controller.onCompleteVideo = function() {
      controller.isCompleted = true;

      controller.currentVideo++;

      if (controller.currentVideo >= controller.videos.length) controller.currentVideo = 0;

      controller.setVideo(controller.currentVideo);
    };

    controller.videos = [
      {
        sources: [
          {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
          {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
          {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
        ]
      },
      {
        sources: [
          {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/big_buck_bunny_720p_h264.mov"), type: "video/mp4"},
          {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/big_buck_bunny_720p_stereo.ogg"), type: "video/ogg"}
        ]
      }
    ];

    controller.config = {
      preload: "none",
      autoHide: false,
      autoHideTime: 3000,
      autoPlay: false,
      sources: controller.videos[0].sources,
      theme: {
        url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
      },
      plugins: {
        poster: "http://www.videogular.com/assets/images/videogular.png"
      }
    };

    controller.setVideo = function(index) {
      controller.API.stop();
      controller.currentVideo = index;
      controller.config.sources = controller.videos[index].sources;
      $timeout(controller.API.play.bind(controller.API), 100);
    };

    controller.getVideos = function() {
      $bw.models.video.find().then(function(videos) {
        console.log(videos);
        //filter through each video and add as source to controller.videos
        $scope.$apply();
      });
    };

    controller.getVideos();

  }]);
