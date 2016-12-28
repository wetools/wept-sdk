
export function range(n, start = 0, suffix = '') {
  const arr = []
  for (let i = start; i <= n; i++) {
    arr.push(i < 10 ? `0${i}${suffix}` : `${i}${suffix}`)
  }
  return arr
}

// TODO use notice
export function showError(message) {
  console.log(message)
}

export const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB

export const IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction


export function getBlobFromUrl(url) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'blob'
  return new Promise(function(resolve, reject) {
    xhr.onload = function() {
      if (xhr.status == 200) {
        resolve(xhr.response)
      } else {
        reject(`${url} fetch error`)
      }
    }
    xhr.send()
  })
}
