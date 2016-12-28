import { getBlobFromUrl } from './util'

export default function ({filePath, name, url, headers, formData}, proxyUrl) {
  return new Promise(function(resolve, reject) {
    getBlobFromUrl(filePath).then(file => {
      let xhr = new XMLHttpRequest()
      xhr.open('POST', proxyUrl || url)
      xhr.onload = function () {
        if (Math.floor(xhr.status/100) == 2) {
          resolve({statusCode: xhr.status})
        } else {
          reject(new Error(`request error ${xhr.status}`))
        }
      }
      xhr.onerror = function (e) {
        reject(new Error(`request error ${e.message}`))
      }
      let key
      for (key in headers) {
        xhr.setRequestHeader(key, headers[key]);
      }
      if (proxyUrl) xhr.setRequestHeader('X-Remote', url);
      let body = new FormData
      body.append(name || 'file', file)
      for (key in formData) {
        body.append(key, formData[key])
      }
      xhr.send(body)
    }, reject)
  })
}
