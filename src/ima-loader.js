// ima-loader.js
export default function (cb, timeout = 6000, debug = false) {
  let win = window, doc = document, el = 'script', timer = null

  let onLoad = (r) => {
    win.clearTimeout(timer)
    if (typeof cb === 'function') cb(r)
  }

  if (win.google && win.google.ima) {
    return onLoad(true)
  }

  let first = doc.getElementsByTagName(el)[0]
  let script = doc.createElement(el)

  script.src = 'https://imasdk.googleapis.com/js/sdkloader/ima3'+(debug ? '_debug' : '')+'.js'
  script.async = true
  if (typeof cb === 'function') script.onload = () => { onLoad(true) }
  first.parentNode.insertBefore(script, first)
  if (timeout) {
    timer = win.setTimeout(() => {
      onLoad(false)
    }, timeout)
  }
}
