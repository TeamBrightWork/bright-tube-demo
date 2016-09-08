'use strict';

/**
 * @ngdoc function
 * @name bwTubeDemoApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the bwTubeDemoApp
 */
angular.module('bwTubeDemoApp')
  .controller('UploadCtrl', ['$scope', 'FileUploader', '$bw', '$sce', function ($scope, FileUploader, $bw, $sce) {

    $scope.tags = [];
    var uploaded = {};

    $scope.fileAdded = false;
    $scope.isUploading = false;
    $scope.uploaded = false;

    var headers = {
      apikey: '51553aaae4b340db9facd6717590570d',
      'Content-Type': ''
    };

    var uploader = $scope.uploader = new FileUploader({
      url: 'http://brighttube.bwapps.io/api/brighttube/storage',
      // alias: 'file',
      headers: headers,
      // queue: [],
      // progress: 0,
      // autoUpload: false,
      removeAfterUpload: true,
      method: 'POST',
      // filters: [],
      // formData: [],
      // queueLimit: Number.MAX_VALUE,
      // withCredentials: false,
      // disableMultipart: false
      autoUpload: true
    });

    $scope.clickUpload = function(){
      document.getElementById('upload').click();
    };

    var saveVideoData = function(videoData){

      console.log(videoData);

      // return $bw.models.video.create(videoData).then(function(newVideo){
      //   console.log('VIDEO Added to DB: ', newVideo);
      //
      //   return newVideo;
      // });

    };

    $scope.addTag = function(){

      var tag = {
        name: $scope.tag
      };

      // TODO: Store tag data in DB using uploadedVideoID

      // $bw.models.video.tag.add(uploaded.id, tag).then(function(newTag){
      //   console.log('TAG Added to DB: ', newTag);
      //   tag.id = newTag.id;
          $scope.tags.push(tag);
          $scope.tag = '';
      // });


    };

    $scope.removeTag = function(name){
      console.log('this',this.tag)

      var toRemove = this.tag;

      $scope.tags.forEach(function(tag, idx){
        console.log(tag);
        if(tag.name === toRemove.name){

          // TODO: Remove tag data from DB

          // $bw.models.video.tag.remove(uploaded.id, tag.id).then(function(newTag){
          //   console.log('TAG Added to DB: ', newTag);
          // });

          $scope.tags.splice(idx, 1);
        }
      });
    };

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
      console.info('onWhenAddingFileFailed', item, filter, options);
    };

    uploader.onAfterAddingFile = function(fileItem) {
      console.info('onAfterAddingFile', fileItem);
      $scope.fileAdded = fileItem;
    };

    uploader.onBeforeUploadItem = function(item) {
      console.info('onBeforeUploadItem', item);
      $scope.isUploading = true;
    };

    uploader.onSuccessItem = function(fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);

      var videoData = {
        url: response.url,
        name: response.name,
        type: response.type
      };

      saveVideoData(videoData).then(function(newVideo){
        console.log("Video Stored with Id: ", newVideo);
        uploaded.id = newVideo.id;
      });

      $scope.isUploading = false;
      $scope.uploaded = $sce.trustAsResourceUrl(response.url);

    };

    uploader.onErrorItem = function(fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);

      // TODO: remove on once wired up to object storage
      $scope.isUploading = false;
      $scope.uploaded = $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4");
    };

    uploader.onCompleteItem = function(fileItem, response, status, headers) {
      console.info('onCompleteItem', fileItem, response, status, headers);
    };

    console.info('uploader', uploader);

  }]);
