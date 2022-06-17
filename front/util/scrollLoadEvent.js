class ScrollLoadEvent {
  constructor (loadEvent) {
    this.loadState = true
    this.loadEvent = loadEvent
    this.scrollEventEnd = null
  }

  scrollEvent () {
    const clientHeight = document.documentElement.clientHeight
    const scrollHeight = document.documentElement.scrollHeight
    const scrollTop = document.documentElement.scrollTop
    if (clientHeight + scrollTop + 30 > scrollHeight && scrollHeight > clientHeight) {
      if (this.loadState) {
        this.loadEvent()
      }
    }
  }

  bindScrollEvent () {
    this.scrollEventEnd = this.scrollEvent.bind(this)
    window.addEventListener('scroll', this.scrollEventEnd)
  }

  removeScrollEvent () {
    window.removeEventListener('scroll', this.scrollEventEnd)
  }
}

export default ScrollLoadEvent