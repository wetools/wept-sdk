/*global Recorder*/
window.AudioContext = window.AudioContext || window.webkitAudioContext;

let audioContext = window.AudioContext && new AudioContext();
let audioInput = null,
    realAudioInput = null,
    inputPoint = null,
    audioRecorder = null;
let analyserNode

function initAudio() {
  if (!navigator.getUserMedia)
      navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  return new Promise(function (resolve, reject) {
    if (audioRecorder) return resolve()
    navigator.getUserMedia({
      "audio": {
      "mandatory": {
          "googEchoCancellation": "false",
          "googAutoGainControl": "false",
          "googNoiseSuppression": "false",
          "googHighpassFilter": "false"
      },
      "optional": []
      },
    }, function (stream) {
      inputPoint = audioContext.createGain();
      // Create an AudioNode from the stream.
      realAudioInput = audioContext.createMediaStreamSource(stream);
      audioInput = realAudioInput;
      audioInput.connect(inputPoint);
      // audioInput = convertToMono( input );
      analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 2048;
      inputPoint.connect( analyserNode );

      audioRecorder = new Recorder( inputPoint );

      let zeroGain = audioContext.createGain();
      zeroGain.gain.value = 0.0;
      inputPoint.connect( zeroGain );
      zeroGain.connect( audioContext.destination );
      resolve()
    }, function(e) {
      reject(e)
    })
  })
}

function emptyFn() { }

let recording = false

/**
 * Record component
 *
 * @returns {object}
 */
export default {
  /**
   * startRecord
   *
   * @public
   * @param  {object}  o - config
   * @param  {function}  o.success - success callback
   * @param  {function}  [o.fail] - fail callback
   * @returns {Promise}
   */
  startRecord: function (o) {
    let fail = o.fail || emptyFn
    if (!window.AudioContext) {
      fail(new Error('No audio API detected'))
      return Promise.reject()
    }
    return initAudio().then(() => {
      this.success = o.success
      this.stopRecord().then(() => {
        recording = true
        audioRecorder.clear();
        audioRecorder.record();
      })
      setTimeout(() => {
        this.stopRecord()
      }, 60000)
    }, fail)
  },
  /**
   * Stop current record
   *
   * @public
   * @returns {Promise} - resolved with objectURL
   */
  stopRecord: function () {
    if (!recording) return Promise.resolve(null)
    recording = false
    audioRecorder.stop()
    return new Promise(resolve => {
      audioRecorder.exportWAV(blob => {
        let url = (window.URL || window.webkitURL).createObjectURL(blob)
        if (this.success) this.success(url)
        resolve(url)
      })
    })
  }
}
