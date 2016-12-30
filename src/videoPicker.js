import filePicker from 'file-picker'

const URL = (window.URL || window.webkitURL)

export default function () {
  return new Promise(function(resolve) {
    filePicker({accept: 'video/*' }, files => {
      let path = URL.createObjectURL(files[0])
      let video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = function () {
        let duration = video.duration
        let size = files[0].size
        resolve({
          duration,
          size,
          height: video.videoHeight,
          width: video.videoWidth,
          url: path
        })
      }
      video.src =  path
    })

  })
}
