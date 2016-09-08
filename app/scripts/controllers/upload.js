'use strict';

/**
 * @ngdoc function
 * @name bwTubeDemoApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the bwTubeDemoApp
 */
angular.module('bwTubeDemoApp')
  .controller('UploadCtrl', ['$scope', 'FileUploader', '$bw', '$sce', '$apiConfig', function ($scope, FileUploader, $bw, $sce, $apiConfig) {

    $scope.tags = [];
    var uploaded = {};

    $scope.fileAdded = false;
    $scope.isUploading = false;
    $scope.uploaded = false;

    var headers = {
      apikey: $apiConfig.apiKey,
      name: ''
    };

    var uploader = $scope.uploader = new FileUploader({
      url: $apiConfig.appUrl + '/api/brighttube/storage',
      alias: 'object',
      headers: headers,
      removeAfterUpload: false,
      method: 'POST',
      autoUpload: true
    });

    $scope.clickUpload = function(){
      document.getElementById('upload').click();
    };

    var saveVideoData = function(videoData){

      console.log(videoData);

      //TODO: enable saving video
       return $bw.models.video.create(videoData).then(function(newVideo){
         console.log('VIDEO Added to DB: ', newVideo);

         return newVideo;
       });

    };

    $scope.addTag = function(){


       // TODO: Store tag data in DB using uploadedVideoID
       $bw.models.video.tags.add(uploaded.id, { name: $scope.tag }).then(function(updatedVideo){
         console.log('TAG Added to DB: ', updatedVideo);
         $scope.tags = updatedVideo.tags;
         $scope.tag = '';
         $scope.$apply();
       });


    };

    $scope.removeTag = function(name){
      console.log('this',this.tag)

      var toRemove = this.tag;

      $scope.tags.forEach(function(tag, idx){
        console.log(tag);
        if(tag.name === toRemove.name){

          // TODO: Remove tag data from DB

           $bw.models.video.tags.remove(uploaded.id, tag.id).then(function(newTag){
             console.log('TAG Added to DB: ', newTag);
           });

          $scope.tags.splice(idx, 1);
        }
      });
    };

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
