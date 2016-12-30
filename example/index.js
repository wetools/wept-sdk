import event from 'event'
import {
  actionSheet,
  mask,
  modal,
  music,
  Picker,
  TimePicker,
  DatePicker,
  spin,
  toast,
  notice,
  ImagesPreview
} from '../src/index'

let handlers = {
  showNotice: function () {
    notice('This is error', {
      type: 'error'
    })
  },
  previewImages: function () {
    let urls = ['http://assets.jiangwoo.com/uploads%2F7338f5556a8cae202e41e73aae620351-IMG_2667.jpg',
      'http://assets.jiangwoo.com/uploads%2Fc766f07cc620efd7dbe40957e74eb278-IMG_1511.jpg',
      'http://assets.jiangwoo.com/uploads%2F371414030ee0aaf96f7b5b9cef5d6683-IMG_1560.jpg']
    let current = urls[0]
    let preview = new ImagesPreview(urls, {})
    preview.show()
    preview.active(current)
  },
  showSpin: function () {
    let hide = mask('rgba(0,0,0,0.3)')
    let pel = document.querySelector('.mask')
    spin(pel, {
      size: 40
    })
    setTimeout(() => {
      hide()
    }, 1000)
  },
  showActionSheet: function () {
    actionSheet({
      itemList: ['a', 'b', 'c'],
      itemColor: '#000000'
    }).then(res => {
      if(res.cancel) {
        console.log('cancel')
      } else {
        console.log(res.tapIndex) // index from 0
      }
    })
  },
  showModal: function () {
    modal({
      title: 'title',
      content: 'content'
    }).then(confirm => {
      if (confirm) {
        console.log('confirm')
      } else {
        console.log('cancel')
      }
    })
  },
  showMask: function () {
    let hide = mask('rgba(0,0,0,0.3)')
    setTimeout(() => {
      hide()
    }, 1000)
  },
  showPicker: function () {
    let p = new Picker({
      array: ['a', 'b', 'c'],
      current: 1
    })
    p.show()
    p.on('select', idx => {
      console.log(idx)
    })
  },
  showToast: function () {
    toast.show({
      duration: 1000,
      icon: 'loading',
      title: 'wait',
      mask: true
    })
  },
  showDatePicker: function () {
    let picker = new DatePicker({
      range: {
        start: '2016-01-01',
        end: '2018-01-01'
      }
    })
    picker.show()
    picker.on('select', str => {
      console.log(str)
    })
  },
  showTimePicker: function () {
    let picker = new TimePicker({
      current: '11:11'
    })
    picker.show()
    picker.on('select', str => {
      console.log(str)
    })
  },
  playMusic: function () {
    music.play('http://yinyueshiting.baidu.com/data2/music/122873158/49046814400128.mp3?xcode=7f4ffbee828316f00c0d8753917afb85')
  },
  stopMusic: function () {
    music.stop()
  }
}

let btns = document.querySelectorAll('.btn')
Array.from(btns).forEach(btn => {
  event.bind(btn, 'click', () => {
    handlers[btn.getAttribute('on-click')]()
  })
})
