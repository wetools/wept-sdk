/*global describe, it, before, after*/
import assert from 'assert'
import {
  fileManage,
  downloadFile,
  uploadFile,
  imgInfo,
  mask,
  modal,
  motion,
  music,
  Picker,
  TimePicker,
  storage,
  toast
} from '../src/index'

describe('downloadFile', () => {
  it('should download file', done => {
    downloadFile('https://pic1.zhimg.com/v2-953292cea62942adfcfe392fe29672e4_b.jpg').then(res => {
      assert(res.statusCode)
      assert(res.tempFilePath)
      done()
    }, done)
  }).timeout(5000)
})

describe('sdk file manager', () => {
  before(done => {
    // may need upgrade
    setTimeout(done, 300)
  })

  after(done => {
    fileManage.clear().then(done, done)
  })

  function saveFile() {
    let debug = {hello: "world"}
    let blob = new Blob([JSON.stringify(debug, null, 2)], {type : 'application/json'})
    let url = URL.createObjectURL(blob)
    return fileManage.save(url)
  }

  it('should save file to db', done => {
    saveFile().then(savedPath => {
      assert.equal(/^wept/.test(savedPath), true)
      done()
    }, done)
  })

  it('should get file info', done => {
    saveFile().then(savedPath => {
      fileManage.getFileInfo(savedPath).then(obj => {
        assert.equal(obj.size, 22)
        assert(obj.createTime)
        done()
      }, done)
    }, done)
  })

  it('should remove stored file', done => {
    saveFile().then(savedPath => {
      fileManage.remove(savedPath).then(() => {
        fileManage.getFileInfo(savedPath).catch(e => {
          assert(/not\sexist/.test(e.message))
          done()
        })
      }, done)
    })
  })

  it('should get all saved files', done => {
    Promise.all([saveFile(), saveFile()]).then(() => {
      fileManage.getFileList().then(res => {
        assert(res.length >= 2)
        assert(res[0].size)
        assert(res[0].filePath)
        done()
      }, done)
    }, done)
  })

  it('should clear db', done => {
    fileManage.clear().then(() => {
      fileManage.getFileList().then(res => {
        assert(res.length == 0)
        done()
      }, done)
    }, done)
  })

  it('should generate url', done => {
    saveFile().then(filePath => {
      fileManage.toURL(filePath).then(url => {
        assert(/^blob:http/.test(url))
        done()
      }, done)
    }, done)
  })
})

describe('imgInfo', () => {

  it('should get img info', done => {
    imgInfo('https://pic1.zhimg.com/v2-953292cea62942adfcfe392fe29672e4_b.jpg').then(res => {
      assert.equal(typeof res.width, 'number')
      assert.equal(typeof res.height, 'number')
      done()
    }, done)
  })
})

describe('mask', () => {
  it('should show mask', () => {
    let hide = mask()
    assert(document.querySelector('.mask'))
    hide()
  })

  it('should hide mask', () => {
    let hide = mask()
    assert(document.querySelector('.mask'))
    hide()
    assert.equal(document.querySelector('.mask'), null)
  })
})

describe('modal', () => {
  it('should confirm for modal', done => {
    modal({title: 'a', content: 'b'}).then(res => {
      assert.equal(res, true)
      done()
    }, done)
    let btn = document.querySelector('.confirm-btn')
    btn.click()
  })

  it('should cancel for modal', done => {
    modal({title: 'a', content: 'b'}).then(res => {
      assert.equal(res, false)
      done()
    }, done)
    let btn = document.querySelector('.cancel-btn')
    btn.click()
  })
})

describe('motion', () => {
  it('should watch and unwatch', done => {
    motion.watch(() => {
    })
    setTimeout(() => {
      motion.unwatch()
      done()
    }, 200)
  })
})

describe('music', () => {
  it('should play & stop', done => {
    music.play('http://yinyueshiting.baidu.com/data2/music/122873158/49046814400128.mp3?xcode=7f4ffbee828316f00c0d8753917afb85')
    setTimeout(() => {
      music.stop()
      done()
    }, 300)
  })

  it('should get status', done => {
    music.play('http://yinyueshiting.baidu.com/data2/music/122873158/49046814400128.mp3?xcode=7f4ffbee828316f00c0d8753917afb85')
    setTimeout(() => {
      let obj = music.getStatus()
      assert(obj.currentPosition)
      assert(obj.dataUrl)
      assert(obj.hasOwnProperty('downloadPercent'))
      assert(obj.duration)
      assert(obj.status)
      music.stop()
      done()
    }, 300)
  })
})

describe('Picker', () => {
  it('should show and hide picker', () => {
    let picker = new Picker({
      array: ['a', 'b'],
      current: 0
    })
    picker.show()
    picker.hide()
  })
})

describe('TimePicker', () => {
  it('should show and hide time picker', () => {
    let picker = new TimePicker({
      current: '12:00'
    })
    picker.show()
    picker.hide()
  })
})

describe('toast', () => {
  it('should show and hide toast', () => {
    toast.show({title: 'loading'})
    toast.hide()
  })
})

describe('uploadFile', () => {
  it('should not upload file', done => {
    let debug = {hello: "world"}
    let blob = new Blob([JSON.stringify(debug, null, 2)], {type : 'application/json'})
    let url = URL.createObjectURL(blob)
    uploadFile({
      filePath: url,
      url: '/'
    }).catch(e => {
      done()
    })
  })
})

describe('storage', () => {
  it('should suppport set & get', () => {
    storage.set('x', 1, 'number')
    let res = storage.get('x')
    assert.equal(res.data, 1)
    assert.equal(res.dataType, 'number')
    storage.clear()
  })
})
