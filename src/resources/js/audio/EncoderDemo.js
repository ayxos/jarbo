// manually rewritten from CoffeeScript output
// (see dev-coffee branch for original source)

// navigator.getUserMedia shim
navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

// URL shim
window.URL = window.URL || window.webkitURL;

// audio context + .createScriptProcessor shim
var audioContext = new AudioContext;
if (audioContext.createScriptProcessor == null)
  audioContext.createScriptProcessor = audioContext.createJavaScriptNode;

// elements (jQuery objects)
var $recording = $('#recording'),
    $timeDisplay = $('#time-display'),
    $record = $('#record'),
    $cancel = $('#cancel'),
    $dateTime = $('#date-time'),
    $recordingList = $('#recording-list');

/*
test tone (440Hz sine with 2Hz on/off beep)
-------------------------------------------
            ampMod    output
osc(sine)-----|>--------|>----->(testTone)
              ^         ^
              |(gain)   |(gain)
              |         |
lfo(square)---+        0.5

/*
master diagram
--------------
              testToneLevel
(testTone)----------|>---------+
                               |
                               v
                            (mixer)---+--->(input)--->(processor)
                               ^      |                    |
              microphoneLevel  |      |                    v
(microphone)--------|>---------+      +------------->(destination)
*/
var microphone = undefined,     // obtained by user click
    microphoneLevel = audioContext.createGain(),
    mixer = audioContext.createGain(),
    input = audioContext.createGain(),
    processor = undefined;      // created on recording
microphoneLevel.gain.value = 0.9;
microphoneLevel.connect(mixer);
mixer.connect(input);
// mixer.connect(audioContext.destination);

if (microphone == null)
  navigator.getUserMedia({ audio: true },
    function(stream) {
      microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(microphoneLevel);
    },
    function(error) {
      $('#record').attr('disabled', true);
      $('#warning').show();
      $('.warning').show();
      window.alert("Could not get audio input.");
    });

// encoding process selector
var encodingProcess = 'separate';       // separate | background | direct

// processor buffer size
var BUFFER_SIZE = [256, 512, 1024, 2048, 4096, 8192, 16384];

var defaultBufSz = (function() {
  processor = audioContext.createScriptProcessor(undefined, 2, 2);
  return processor.bufferSize;
})();

var iDefBufSz = BUFFER_SIZE.indexOf(defaultBufSz);

// Vorbis quality
var QUALITY = [-0.1, 0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    KBPS    = [  45,  64,  80,  96, 112, 128, 160, 192, 224, 256, 320, 500];

// save/delete recording
function saveRecording(blob) {
  timer();
  window.setBlob(blob);
  var d = new Date();
  var time = d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() +  ":" + d.getSeconds();
  var url = URL.createObjectURL(blob);
  var html = "<div class='audioBox' recording='" + url + "'>" +
    "<audio controls src='" + url + "'></audio><br> " + time +
    " <ul id='audioButtons'><li><a class='icon blue btn-outlined btn btn-default' id='download' title='descargar' href='" + url +
        "' download='recording.wav'>" +
        "<img src='http://www.freeiconspng.com/uploads/download-png-6.png'>" +
    "</a></li> " +
    "<li><button class='icon btn btn-default' title='eliminar' id='remove' recording='" +
            url + "'><img src='http://www.freeiconspng.com/uploads/remove-icon-png-25.png'></button></li>" +
    "<li><button class='icon btn btn-default' title='continuar' id='continue' recording='" +
            url + "'> Next </button></li>" +
    "</ul></div>";
  $recordingList.prepend($(html));
}

$recordingList.on('click', 'button', function(event) {
  if (event.target.id === 'continue') {
    var duration = $(event.target.parentElement.parentElement.parentElement).find("audio")[0].duration;
    window.setDuration(duration);
    window.setBlob(null);
  } else {
    var url = $(event.target).attr('recording');
    $("div[recording='" + url + "']").remove();
    URL.revokeObjectURL(url);
  }
});

// recording process
var worker = new Worker('./resources/js/audio/EncoderWorker.js');

worker.onmessage = function(event) { saveRecording(event.data.blob); };

function getBuffers(event) {
  var buffers = [];
  for (var ch = 0; ch < 2; ++ch)
    buffers[ch] = event.inputBuffer.getChannelData(ch);
  return buffers;
}

function startRecordingProcess() {
  var bufSz = BUFFER_SIZE[iDefBufSz];
  processor = audioContext.createScriptProcessor(bufSz, 2, 2);
  input.connect(processor);
  processor.connect(audioContext.destination);
  worker.postMessage({
    command: 'start',
    process: encodingProcess,
    sampleRate: audioContext.sampleRate,
    numChannels: 2,
    quality: QUALITY[5]
  });
  processor.onaudioprocess = function(event) {
    worker.postMessage({ command: 'record', buffers: getBuffers(event) });
  };
}

function stopRecordingProcess(finish) {
  input.disconnect();
  processor.disconnect();
  worker.postMessage({ command: finish ? 'finish' : 'cancel' });
}

// recording buttons interface
var startTime = null    // null indicates recording is stopped

function minSecStr(n) { return (n < 10 ? "0" : "") + n; }

function updateDateTime() {
  if (startTime != null) {
    var sec = Math.floor((Date.now() - startTime) / 1000);
    var maxTime = window.maxTime*60;
    if (sec > maxTime) {
      window.reachMaxTime();
      stopRecording();
    }
    $timeDisplay.html(minSecStr(sec / 60 | 0) + ":" + minSecStr(sec % 60));
  }
}

window.setInterval(updateDateTime, 200);

function disableControlsOnRecord(disabled) {
  if (microphone == null)
    $microphone.attr('disabled', disabled);
}

function startRecording() {
  startTime = Date.now();
  $recording.removeClass('hidden');
  $record.html('STOP');
  $cancel.removeClass('hidden');
  disableControlsOnRecord(true);
  startRecordingProcess();
}
var timerID;
function stopRecording(finish) {
  timerID = timer();
  startTime = null;
  $timeDisplay.html('00:00');
  $recording.addClass('hidden');
  $record.html('RECORD');
  $cancel.addClass('hidden');
  disableControlsOnRecord(false);
  stopRecordingProcess(finish);
}

var tic = false;
var startTimer, endTimer;
function timer() {
  if (tic) {
    $('#loading').hide();
    window.clearInterval(timerID);
    tic = false;
  } else {
    tic = true;
    var totalSeconds = hmsToSecondsOnly($timeDisplay.text());
    startTimer = new Date();
    // end Time total of seconds per 10sec/min postprocessings
    var totalTime = ((totalSeconds/60)*14);
    endTimer = new Date(startTimer.getTime() + totalTime * 1000);
    $('#loading').show();
    return window.setInterval(updateTimer, 200);
  }
}

function updateTimer() {
  var now = new Date(), // now
      p = Math.round(((now - startTimer) / (endTimer - startTimer)) * 100);
  // Update the progress bar
  $('#percentage').text( (p <= 100) ? (p + '%') : (100 + '%'));
}

function hmsToSecondsOnly(str) {
  var p = str.split(':'),
      s = 0, m = 1;
  while (p.length > 0) {
      s += m * parseInt(p.pop(), 10);
      m *= 60;
  }
  return s;
}

$record.click(function() {
  if (startTime != null)
    stopRecording(true);
  else
    startRecording();
});

$cancel.click(function() { stopRecording(false); });
