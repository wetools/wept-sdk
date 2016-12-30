import event from 'event'
import {
  actionSheet,
  mask,
  modal,
  music,
  Picker,
  TimePicker,
  DatePicker,
  toast
} from '../src/index'

let handlers = {
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
