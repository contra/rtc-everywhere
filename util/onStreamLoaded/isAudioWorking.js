'use strict';

var checkTracks = require('./checkTracks');
var onMicChange = require('../onMicChange');
var timeoutTime = 20000;

// basic premise:
// - check for working audio tracks
// - listen for an audio event with any volume to happen

function isAudioWorking(stream, cb){
  if (!checkTracks(stream, 'audio')) return cb('dead audio');
  if (stream._audioMeta) return cb(null, stream._audioMeta);
  if (typeof cordova !== 'undefined') return cb();
  var finished = false;
  var listener = onMicChange(stream, handleMicEvent);
  var timeout = setTimeout(finishIt.bind(null, 'no microphone data'), timeoutTime);

  function finishIt(err){
    if (finished) return;
    finished = true;
    clearTimeout(timeout);
    listener.end();
    if (!err) {
      stream._audioMeta = {}; // TODO
    }
    cb(err, stream._audioMeta);
  }
  function handleMicEvent(vol){
    if (!finished && vol > 0) finishIt();
  }
}

module.exports = isAudioWorking;
