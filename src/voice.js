import once from 'once'
import {domready} from './util'

let el = document.createElement('audio')
domready(() => {
  el.style.display = 'none'
  document.body.appendChild(el)
})

/**
 * Voice component
 *
 * @returns {object}
 */
export default {
  /**
   * play
   *
   * @public
   * @param {string} url - source url
   * @returns {Promise}
   */
  play: function (url) {
    return new Promise(function(resolve, reject) {
      if (el.src && el.src == url && el.paused && !el.ended) {
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
  /**
   * pause voice player
   *
   * @public
   */
  pause: function () {
    el.pause()
  },
  /**
   * Stop voice play
   *
   * @public
   */
  stop: function () {
    el.pause()
    el.currentTime = 0
    el.src = ''
  }
}
