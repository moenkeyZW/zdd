Component({
  /**
   * 组件的属性列表
   */
  properties: {
    propA: {
      type: String,
      value: '',
      observer(newVal, oldVal, changedPath) {
        var _this = this;
        var length = _this.data.propA.length * _this.data.size+150;
        var windowWidth = wx.getSystemInfoSync().windowWidth-150
        _this.setData({
          length: length,
        });
        _this.data.windowWidth = windowWidth;
        _this._scrolling();
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    windowWidth:'',
    marqueePace: 1,
    marqueeDistance: 0,
    size: 14,
    interval: 20,
    timers:'',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _scrolling: function () {
      var _this = this;
      var timer = setInterval(() => {
        if (-_this.data.marqueeDistance < _this.data.length) {
          _this.setData({
            marqueeDistance: _this.data.marqueeDistance - _this.data.marqueePace
          })
        } else {
          clearInterval(timer);
          _this.setData({
            marqueeDistance: _this.data.windowWidth
          });
          _this._scrolling();
        }
      }, _this.data.interval);
      _this.data.timers = timer
    }
  },
  pageLifetimes: {
    show() {
      // 页面被展示
      this._scrolling();
    },
    hide() {
      clearInterval(this.data.timers);
    },

  }

})


