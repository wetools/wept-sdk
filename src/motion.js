import throttle from 'throttleit'
import {showError} from './util'

let handler = null

/**
 * Acceleration watcher component
 * @returns {object}
 */
export default {
  /**
   * Add a watcher
   *
   * @public
   * @param  {Function}  fn
   */
  watch: function (fn) {
    if (handler) return
    if (!window.DeviceMotionEvent) return showError('motion not supported')
    let handler = throttle(event => {
      let obj = {
        x: event.accelerationIncludingGravity.x,
        y: event.accelerationIncludingGravity.y,
        z: event.accelerationIncludingGravity.z
      }
      fn(obj)
    }, 200)
    window.addEventListener("devicemotion", handler, false);
  },
  /**
   * Remove current watcher
   */
  unwatch: function () {
    if (handler) window.removeEventListener("devicemotion", handler, false);
    handler = null
  }
}
