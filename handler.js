
'use strict';
let AWS = require("aws-sdk");
var polly = new AWS.Polly({apiVersion: '2016-06-10'});

module.exports.speak = (event, context, callback) => {

  const requestBody = JSON.parse(event.body);

  const pollyParams = {
    OutputFormat: "mp3",
    Text: requestBody.text,
    VoiceId: requestBody.voice,
    TextType: "ssml"
  };

  // 1. Getting the audio stream for the text that user entered
  polly.synthesizeSpeech(pollyParams)
    .on("success", function (response) {
      let data = response.data;
      let audioStream = data.AudioStream;
      let base64audio = audioStream.toString('base64');

      let result = {say: base64audio};
      callback(null, {
        statusCode: 200, 
        body: JSON.stringify(result)
      });
    })
    .on("error", function (err) {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify(err)
      });
    })
    .send();
};

