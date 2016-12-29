import {
  indexedDB,
  getBlobFromUrl,
  showError
} from './util'
import uid from 'uid'
import Emitter from 'emitter'

const dbVersion = 4
let root = window.__wxConfig__ ? window.__wxConfig__.directory : 'test'

class FileManage extends Emitter {
  constructor(root) {
    super()
    this.root = root.replace(/\//g, '_')
    let request = this.request = indexedDB.open('WEPT_FILES', dbVersion)
    request.onupgradeneeded = event => {
      let db = event.target.result
      db.createObjectStore(root)
    }
    request.onerror = () => {
      showError('error opening indexedDB')
    }
    request.onsuccess = () => {
      let db = this.db = this.request.result
      db.onerror = () => {
        showError('Error creating/accessing IndexedDB database')
      }
    }
  }
  /**
   * Save ObjectURL to db
   *
   * @public
   * @param {string} url - ObjectURL
   * @returns {Promise}
   */
  save(url) {
    let {db} = this
    if (!db) return Promise.reject(new Error('indexedDB not ready'))
    return getBlobFromUrl(url).then(blob => {
      let transaction = db.transaction([this.root], 'readwrite')
      let savedPath = `wept://${uid(10)}`
      return new Promise((resolve, reject) => {
        let req = transaction.objectStore(this.root).add({
          file: blob,
          size: blob.size,
          filePath: savedPath,
          createTime: Date.now()
        }, savedPath)
        req.onsuccess = () => {
          resolve(savedPath)
        }
        req.onerror = reject
      })
    })
  }
  /**
   * Get file info from saved path
   *
   * @public
   * @param {string} savedPath
   * @returns {Promise} - resolved with info
   */
  getFileInfo(savedPath) {
    let {db} = this
    if (!db) return Promise.reject(new Error('indexedDB not ready'))
    return new Promise((resolve, reject) => {
      let transaction = db.transaction([this.root], 'readwrite')
      let req = transaction.objectStore(this.root).get(savedPath)
      req.onerror = reject
      req.onsuccess = () => {
        let res = req.result
        if (!res) return reject(new Error(`${savedPath} not exists`))
        resolve(res)
      }
    })
  }
  /**
   * Remove a saved file
   *
   * @public
   * @param {string} savedPath - string
   * @returns {Promise}
   */
  remove(savedPath) {
    let {db} = this
    if (!db) return Promise.reject(new Error('indexedDB not ready'))
    return new Promise((resolve, reject) => {
      let transaction = db.transaction([this.root], 'readwrite')
      let req = transaction.objectStore(this.root).delete(savedPath)
      req.onerror = reject
      req.onsuccess = () => {
        resolve()
      }
    })
  }
  /**
   * getFileList array
   *
   * @public
   * @returns {Promise} - resolved with array of info
   */
  getFileList() {
    let {db} = this
    if (!db) return Promise.reject(new Error('indexedDB not ready'))
    return new Promise((resolve, reject) => {
      let transaction = db.transaction([this.root], 'readwrite')
      let req = transaction.objectStore(this.root).getAll()
      req.onerror = reject
      req.onsuccess = () => {
        resolve(req.result)
      }
    })
  }
  /**
   * Convert saved path to ObjectURL
   *
   * @public
   * @param {string} filePath - saved path
   * @returns {Promise}
   */
  toURL(filePath) {
    return this.getFileInfo(filePath).then(record => {
      let blob = record.file
      let url = (window.URL || window.webkitURL).createObjectURL(blob)
      return url
    })
  }
  /**
   * clear current store
   *
   * @public
   */
  clear() {
    let {db} = this
    if (!db) return Promise.reject(new Error('indexedDB not ready'))
    return new Promise((resolve, reject) => {
      let transaction = db.transaction([this.root], 'readwrite')
      let req = transaction.objectStore(this.root).clear()
      req.onerror = reject
      req.onsuccess = () => {
        resolve()
      }
    })
  }
}

export default new FileManage(root)
