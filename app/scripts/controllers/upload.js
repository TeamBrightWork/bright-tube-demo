'use strict';

/**
 * @ngdoc function
 * @name bwTubeDemoApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the bwTubeDemoApp
 */
angular.module('bwTubeDemoApp')
  .controller('UploadCtrl', ['$scope', 'FileUploader', '$bw', '$sce', '$apiConfig', 'lodash', function ($scope, FileUploader, $bw, $sce, $apiConfig, lodash) {

    $scope.tags = [];
    $scope.tagNames = [];
    $scope.selectedTags = [];
    var uploaded = {};

    $scope.fileAdded = false;
    $scope.isUploading = false;
    $scope.uploaded = false;

    // //TODO: (1) Enable upload video to object storage
    var uploader = $scope.uploader = new FileUploader({
      url: $apiConfig.appUrl +  '/api/brighttube/storage',
      alias: 'object',
      headers: {
        apikey: $apiConfig.apiKey,
        name: ''
      },
      removeAfterUpload: false,
      method: 'POST',
      autoUpload: true
    });

    $scope.clickUpload = function(){
      document.getElementById('upload').click();
    };

    var saveVideoData = function(videoData){

      //TODO: (2): enable saving video
      return $bw.models.video.create(videoData).then(function(newVideo){
        console.log('VIDEO Added to DB: ', newVideo);
        return newVideo;
      });

    };

    $scope.addTag = function(){
      console.log('**ADD TAG**', $scope.tag);

      var selectedTag = lodash.find($scope.tags, { name: $scope.tag }) || { name: $scope.tag };

       // TODO: (3) Enable tagging videos and saving
      $bw.models.video.tags.add(uploaded.id, selectedTag).then(function(updatedVideo){
        console.log('TAG Added to DB: ', updatedVideo);
        $scope.selectedTags = updatedVideo.tags;

        if (!selectedTag.id) {
          $scope.tags.push(lodash.find($scope.selectedTags, selectedTag));
        }

        $scope.tag = '';
        $scope.$apply();
      });

      $scope.tag = '';

    };

    $scope.removeTag = function(name){
      var toRemove = this.tag;

      //TODO: (4) Enable removing video tags
      $bw.models.video.tags.remove(uploaded.id, tag.id).then(function(){
        lodash.remove($scope.selectedTags, { name: toRemove });
      });

    };

    // TODO: (5) Enable loading tags from database
    $bw.models.tag.find().then(function(tags){
      $scope.tags = lodash.map(tags, function(item) { return { id: item.id, name: item.name }; });
      $scope.tagNames = lodash.map(tags, 'name');
    });

    uploader.onAfterAddingFile = function(item) {
      console.info('onAfterAddingFile', item);
      $scope.fileAdded = item;
      item.headers.name = item.file.name;
    };

    uploader.onBeforeUploadItem = function(item) {
      console.info('onBeforeUploadItem', item);
      $scope.isUploading = true;
    };

    uploader.onSuccessItem = function(fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);

      var videoData = {
        url: $apiConfig.appUrl + '/api/brighttube/storage/' + response.name,
        name: response.name,
        type: fileItem.file.type
      };

      saveVideoData(videoData).then(function(newVideo){
        console.log("Video Stored with Id: ", newVideo);
        uploaded.id = newVideo.id;
      });

      $scope.isUploading = false;
      $scope.uploaded = $sce.trustAsResourceUrl(videoData.url + "?apikey=" + $apiConfig.apiKey);

    };

    uploader.onErrorItem = function(fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);

      // TODO: remove on once wired up to object storage
      $scope.isUploading = false;
      $scope.uploaded = $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4");
    };

  }]);
