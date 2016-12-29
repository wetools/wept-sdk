import fileManage from './file'
import { getBlobFromUrl } from './util'

/**
 * Upload file to remote server
 *
 * @public
 * @param {object} option
 * @param {string} option.filePath - tempFilePath
 * @param {string} option.url - remote url address
 * @param {object} [option.headers] - custom headers
 * @param {object} [option.formData] - custom formData
 * @param {string} [proxyUrl] - custom proxy url
 * @returns {Promise}
 */
export default function upload({filePath, name, url, headers, formData}, proxyUrl) {
  let args = arguments
  if (/^wept:/.test(filePath)) {
    return fileManage.toURL(filePath).then(url => {
      args[0].filePath = url
      return upload.apply(null, args)
    })
  }
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
