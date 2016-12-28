
export default function (url, headers = {}, proxyUrl) {
  return new Promise(function(resolve, reject) {
    let URL = (window.URL || window.webkitURL)
    if (!URL) return reject(new Error("URL not supported"))
    let xhr = new XMLHttpRequest()
    xhr.responseType = 'arraybuffer'
    xhr.open('GET', proxyUrl || url, true)
    xhr.onload = function () {
      if (xhr.status / 100 | 0 == 2 || xhr.status == 304) {
        let b = new Blob([xhr.response], {type: xhr.getResponseHeader("Content-Type")});
        let blob = URL.createObjectURL(b)
        // TODO save to local File
        //fileStore[blob] = b
        return resolve({
          statusCode: xhr.status,
          tempFilePath: blob
        })
      }
      let err = new Error(`request error ${xhr.status}`)
      err.status = xhr.status
      return reject(err)
    }
    xhr.onerror = function (e) {
      reject(new Error(`request error ${e.message}`))
    }
    for (let key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }
    if (proxyUrl) xhr.setRequestHeader('X-Remote', url);
    xhr.send(null)
  })
}
