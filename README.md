# BrightTube Demo

A demo applicatoion that shows you how quickly you can build a video player using BrightWork as your back-end server.

The final demo app supports:
- uploading
- tagging
- searching
- playback

*This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.*

<iframe width="560" height="315" src="https://www.youtube.com/embed/W5mVluoJBuo" frameborder="0" allowfullscreen></iframe>

## Install dependencies
```
npm install && bower install
```

## Deploy the BrightWork API back-end
Edit the manifest.yaml in the ./bw-backend folder. Change the application name.

Then using the BW CLI:
```
bw login
bw push
```

Once deployed you can find your API key by running.
```
bw list
```

Edit your ./app.js file and put in your app name and API key.

```javascript
.constant('$apiConfig', {
    apiKey: 'YOUR-API-KEY',
    appName:'YOUR-APP',
    apiUrl: 'http://api.brightwork.io',
    appUrl: 'http://YOUR-APP.bwapps.io'
  })
```

## Build & development

Run `grunt` for building and `grunt serve` for preview.

