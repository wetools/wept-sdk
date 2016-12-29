import assign from 'object-assign'

export default function Mask(bgColor = 'transparent') {
  let el = document.createElement('div')
  el.className = 'mask'
  assign(el.style, {
    backgroundColor: bgColor,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 999
  })
  document.body.appendChild(el)
  return function () {
    if (el.parentNode) el.parentNode.removeChild(el)
  }
}
