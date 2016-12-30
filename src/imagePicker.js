import filePicker from 'file-picker'

const URL = (window.URL || window.webkitURL)

export default function ({multiple = true}) {
  return new Promise(function(resolve) {
    filePicker({ multiple: multiple, accept: 'image/*' }, files => {
      files = files || []
      files = [].slice.call(files)
      let arr = files.map(file => {
        let blob = URL.createObjectURL(file)
        return {url: blob, size: file.size}
      })
      resolve(arr)
    })
  })
}
