# wept-sdk

小程序 native 组件 web 端实现

## 测试

    npm install && gulp test
    open http://localhost:8080/bundle

## 运行 UI 示例

    npm install && gulp
    open http://localhost:3000/example/

## 使用

``` js
import {
  fileManage,
  downloadFile,
  uploadFile,
  ...
} from 'wept-sdk'
```

页面上引入 `example/style.css`

## 模块

* `compass` 罗盘模块，提供 `watch` 和 `unwatch` 方法

    ``` js
    let id = compass.watch(direction => {
      // direction 为面对的方向度数
    })
    Compass.unwatch(id)
    ```

* `actionSheet` 模块，返回 promise

    ``` js
    actionSheet({
      itemList: ['a', 'b', 'c'],
      itemColor: '#000000'
    }).then(res => {
      if(res.cancel) {
        // user cancel
      } else {
        console.log(res.tapIndex) // index from 0
      }
    })
    ```

* `DatePicker` 模块，日期选择

    ``` js
    let picker = new DatePicker({
      range: {
        start: '2016-01-01',
        end: '2018-01-01'
      },
    })
    picker.show()
    picker.hide()
    picker.on('select', val => {
      console.log(val) // yyyy-mm-dd
    })
    ```

* `fileManage` 模块，本地文件管理，使用 IndexDB

    ``` js
    // save to db
    fileManage.save(tempFilePath).then(savedPath => {

    })
    fileManage.getFileList().then(arr => {
      // list of file info
    })
    fileManage.getFileInfo(savedPath).then(info => {
      // info.size
      // info.createTime
    })
    fileManage.remove(savedPath).then(() => {
      // remove from db
    })
    ```

* `imageInfo` 模块，获取图片大小

    ``` js
    ImageInfo(tempFilePath).then(obj => {
      // obj.width
      // obj.height
    })
    ```

* `modal` 模块， 弹出窗口

    ``` js
    modal({
      title: '',
      content: '',
      imgUrl: ''
    }).then(confirm => {
      if (confirm) {
      } else {
      }
    })
    ```
* `mask` 模块，透明遮罩，返回隐藏函数

    ``` js
    let hide = mask()
    hide()
    ```

* `Picker` 模块，弹出选择组件

    ``` js
    let picker = new Picker({
      array: ['a', 'b', 'c'],
      current: 2
    })
    picker.show()
    picker.hide()
    picker.on('select', index => {
      // selected index
    })
    picker.on('hide', () => {
      // on picker hide
    })
    ```

* `record` 模块，提供录音功能, 需要全局 `Recorder` 对象支持

    ``` js
    record.startRecord({
      fail: function(err) {
      },
      success: function(url) {
       // object url for wav file
      }
    })
    record.stopRecord()
    ```

* `storage` 模块，提供缓存支持，使用 localStorage

    ``` js
    storage.set(key, value, dataType)
    storage.get(key)
    storage.remove(key)
    storage.clear()
    let obj = storage.getAll()
    // each key of obj contains data & dataType
    let info = storage.info()
    // info.keys
    // info.limitSize
    // info.currentSize
    ```

* `Timepicker` 模块，时间选择功能

    ``` js
    let picker = new TimePicker({
      current: '11:11'
    })
    picker.show()
    picker.hide()
    picker.on('select', str => {
      // selected time string mm:ss
    })
    picker.on('cancel', () => {
      // on picker cancel
    })
    ```

* `toast` 模块，轻提醒组件

    ``` js
    toast.show({
      duration: 1000,
      icon: 'waiting',
      title: 'wait',
      mask: true
    })
    toast.hide()
    ```

* `motion` 模块

    ``` js
    motion.watch(res => {
      //res.x
      //res.y
      //res.z
    })
    motion.unwatch()
    ```

* `voice` 模块

    ``` js
    voice.play(url).then(res => {
    }, err => {
    })
    voice.pause()
    voice.stop()
    ```

* `music` 模块

    ``` js
    let obj = music.getStatus()
    music.on('error', e => {
    })
    music.play()
    music.pause()
    music.seek()
    music.stop()
    ```

* `uploadFile` 模块

    ``` js
    uploadFile({
      filePath: url,
      url: '/'
      name: 'file',
      headers: {},
      formData: {}
    }).then(res => {
      console.log(res)
      done()
    })
    ```

* `downloadFile` 模块

    ``` js
    downloadFile(url, headers, '/remoteProxy').then(res => {
      // res.statusCode
      // res.tempFilePath
    }, err => {
      // request error
      // err.status for statusCode
    })
    ```

## LICENSE

Copyright 2016 chemzqm@gmail.com

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
