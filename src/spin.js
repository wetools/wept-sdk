import raf from 'raf'
import assign from 'object-assign'
import computed from 'computed-style'
import within from 'within-document'
import autoscale from 'autoscale-canvas'

function createCtx(node) {
  let canvas = document.createElement('canvas')
  node.appendChild(canvas)
  let rect = node.getBoundingClientRect()
  canvas.height = rect.height
  canvas.width = rect.width
  autoscale(canvas)
  return canvas
}

const hex_reg = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
function torgb(hex) {
  if (hex.length == 4) hex = hex.replace(/[^#]/g, function (p) {
    return p + p
  })
  let result = hex_reg.exec(hex)
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null
}

export default function (node, opts) {
  opts = opts || []
  if (!within(node) || node.clientHeight == 0 || node.clientWidth == 0) {
    return function() {}
  }
  let h = opts.size || 32
  let w = opts.size || 32
  let pos = computed(node, 'position')
  if (pos == 'static') node.style.position = 'relative'
  let div = document.createElement('div')
  assign(div.style, {
    position: 'absolute',
    width: `${w}px`,
    height: `${h}px`,
    top: `${(node.clientHeight - h)/2}px`,
    left: `${(node.clientWidth - h)/2}px`
  })
  node.appendChild(div)
  let canvas = createCtx(div)
  let ctx = canvas.getContext('2d')
  let duration = opts.duration || 1000
  let color = opts.color || '#ffffff'
  let rgb = torgb(color)
  let x = h/2
  let y = w/2
  let r = Math.min(h, w)/2 - 4
  let stop
  let start
  function step(timestamp) {
    ctx.clearRect(0, 0, w, h)
    if (stop || !within(div)) return
    if (!start) start = timestamp
    let ts = (timestamp - start)%duration
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(' + rgb.r +', ' + rgb.g + ', ' + rgb.b+ ', 0.4)'
    ctx.arc(x, y, r, 0, Math.PI*2)
    ctx.lineWidth = opts.width || 4
    ctx.lineCap = 'round'
    ctx.stroke()
    let a = -Math.PI/2 + Math.PI*2*ts/duration
    let e = a + Math.PI/2
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(' + rgb.r +', ' + rgb.g + ', ' + rgb.b+ ', 1)'
    ctx.arc(x, y, r, a, e)
    ctx.stroke()
    raf(step)
  }
  raf(step)
  return function () {
    if (div.parentNode) div.parentNode.removeChild(div)
    stop = true
  }
}
