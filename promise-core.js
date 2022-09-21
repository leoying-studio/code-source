const MyPromise = (function () {
  function noop() {}

  function resolve(self, newValue) {
    self._state = 1;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._deferredState === 1) {
      handle(self, self._deferreds);
    }
  }

  /**
   *
   * @param {*} self 上一轮的promise 对象
   * @param {*} deferred 当前一轮的对象
   * @returns
   * 该方法主要还是进行了对象赋值存储操作,如此往复就形成了一个树形的结构对象体, 执行的时候再进行递归的执行
   */
  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }

    // 当为0的时候, 说明还没有开始执行,正在加载then.
    // 把下一个then的 promise 对象存储到上一个 对象的deferred属性中
    if (self._state === 0) {
      if (self._deferredState === 0) {
        self._deferredState = 1;
        self._deferreds = deferred;
        return;
      }
      if (self._deferredState === 1) {
        self._deferredState = 2;
        self._deferreds = [self._deferreds, deferred];
        return;
      }
      self._deferreds.push(deferred);
      return;
    }

    // 调用了resolve的时候开始执行
    handleResolved(self, deferred);
  }

  function handleResolved(self, deferred) {
    const cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    const nextValue = cb(self._value);

    //重点, 进入了下一轮递归循环
    resolve(deferred.promise, nextValue);
  }

  function Handler(promise, onFulfilled, onRejected) {
    this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
    this.onRejected = typeof onRejected === "function" ? onRejected : null;
    this.promise = promise;
  }

  function MyPromise(fn) {
    /**
     *  当前的执行状态, 0 代表pending, 1 是 fulfilled with _value, 2 rejected
     */
    this._state = 0;
    /**
     *  resolve 时候的传递值
     */
    this._value = null;

    this._deferreds = null;

    // 存储的实例状态 0代表还未存储 1代表存储了1个 2代表存储了2个
    this._deferredState = 0;

    // 标记是否是noop 实例化,默认是false
    this.noop = false;

    if (fn === noop) {
      this.noop = true;
      return;
    }

    const self = this;
    const resolveCallback = function (value) {
      resolve(self, value);
    };

    const rejectCallback = function () {};

    fn(resolveCallback, rejectCallback);
  }

  MyPromise.prototype.then = function (onFulfilled, onRejected) {
    const promise = new MyPromise(noop);
    handle(this, new Handler(promise, onFulfilled, onRejected));
    return promise;
  };

  return MyPromise;
})();
