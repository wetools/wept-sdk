import once from 'once'
let el = document.createElement('audio')
el.id = 'audio'
document.body.appendChild(el)

export default {
  play: function (url) {
    return new Promise(function(resolve, reject) {
      if (el.src && el.paused && !el.ended) {
        // resume
        el.play()
      } else {
        el.src = url
        el.load()
        el.play()
        el.addEventListener('error', once(e => {
          reject(e)
        }))
        el.addEventListener('ended', once(() => {
          resolve()
        }))
      }
    })
  },
  pause: function () {
    el.pause()
  },
  stop: function () {
    el.pause()
    el.currentTime = 0
    el.src = ''
  }
}
