import Emitter from 'emitter'
import {domready} from './util'

const el = document.createElement('audio')
domready(() => {
  el.style.display = 'none'
  document.body.appendChild(el)
})

/**
 * Background music component
 * @extends {Emitter}
 */
class Audio extends Emitter {
  constructor() {
    super()
    el.onerror = e => {
      this.emit('error', e)
    }
  }
  /**
   * Get current status
   *
   * @public
   * @returns {object} - status object
   */
  getStatus() {
    let obj = {
      status: el.src ? el.paused ? 0 : 1 : 2,
      currentPosition: Math.floor(el.currentTime) || -1
    }
    if (el.src && !el.paused) {
      obj.duration = el.duration || 0
      try {
        obj.downloadPercent = Math.round(100*el.buffered.end(0)/el.duration)
      } catch(e) {
      }
      obj.dataUrl = el.currentSrc
    }
    return obj
  }
  /**
   * play
   *
   * @public
   * @param {string} url
   */
  play(url) {
    if (el.src == url && el.paused && !el.ended) {
      el.play()
    } else {
      el.src = url
      el.load()
      el.loop = true
      el.play()
    }
  }
  pause() {
    el.pause()
  }
  seek(position) {
    el.currentTime = position
  }
  stop() {
    el.pause()
    el.currentTime = 0
    el.src = ''
  }
}

export default new Audio()
