// observable.js

export default class Observable {
  constructor() {
    this.unsubscribeAll()
  }

  subscribe(n, f) {
    if (! this.observers[n]) {
      this.observers[n] = []
    }
    this.observers[n].push(f)
  }

  unsubscribe(n, f) {
    if (! this.observers[n]) {
      return
    }

    let i = this.observers[n].indexOf(f)

    if (i == -1) {
      return
    }

    this.observers[n].splice(i, 1)
  }

  unsubscribeAll(n = null) {
    if (n === null) {
      this.observers = null
      this.observers = {}
    } else if (this.observers[n]) {
      this.observers[n] = null
      delete this.observers[n]
    }
  }

  notify(n, e) {
    if (this.observers[n]) {
      this.observers[n].forEach(o => o(e))
    }
  }
}
