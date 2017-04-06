
export default class InactivityMonitor {
  constructor({timeout, idleAction}) {
    this.timeout = timeout;
    this.timeoutId = 0;
    this.idleAction = idleAction;
    this.setup();
  }

  setup() {
    document.addEventListener('mousemove', this.resetTimer.bind(this), false);
    document.addEventListener('mousedown', this.resetTimer.bind(this), false);
    document.addEventListener('keypress', this.resetTimer.bind(this), false);
    document.addEventListener('DOMMouseScroll', this.resetTimer.bind(this), false);
    document.addEventListener('mousewheel', this.resetTimer.bind(this), false);
    document.addEventListener('touchmove', this.resetTimer.bind(this), false);
    document.addEventListener('MSPointerMove', this.resetTimer.bind(this), false);
    this.startTimer();
  }

  startTimer() {
    this.timeoutID = window.setTimeout(this.idleAction, this.timeout);
  }

  resetTimer() {
    window.clearTimeout(this.timeoutID);
    this.startTimer();
  }
}
