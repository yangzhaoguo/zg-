//index.js
//获取应用实例
var app = getApp();
var URL = getApp().globalData.url;
Page({
  data: {
    goumaijilu: [],
    windowHeight: 0, //获取屏幕高度
    refreshHeight: 0, //获取高度
    refreshing: false, //是否在刷新中
    refreshAnimation: {}, //加载更多旋转动画数据
    clientY: 0, //触摸时Y轴坐标
    start: 1,
    cssActive: 0,
    dataId: 0,

  },
  onShow: function (options) {
    this.loading();
    this.getTypeData();
  },

  onLoad: function () {
    this.refresh();
    this.onShow;
  },
  getTypeData: function () {
    var _this = this;
    var user = wx.getStorageSync('user');
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          windowHeight: res.windowHeight
        })
        console.log("屏幕高度: " + res.windowHeight)
      }
    })
    //获取words
    wx.request({
      url: URL + '/Member/Purchase?member_id=' + user.member_id,
      fail: function () {
        // fail
      },
      complete: function (res) {
        console.log(res.data.data.buy_list);
        if (res.data.code == '200') {
          var datass2 = res.data.data.buy_list;

          for (var i = 0; i < datass2.length; i++) {
            if (datass2[i]['clicks'] >= 10000) {
              datass2[i]['clicks'] = (datass2[i]['clicks'] / 10000).toFixed(2) + '万'
            }
          }
          _this.setData({
            goumaijilu: res.data.data.buy_list,

          })
        }
      }
    })
  },
  scroll: function () {
    console.log("滑动了...")
  },
  lower: function () {
    var num = this.data.start;
    var user = wx.getStorageSync('user');
    console.log('第' + num + '页');
    num++;
    console.log("加载了...")
    var _this = this;
    wx.request({
      url: URL + '/Member/Purchase?member_id=' + user.member_id +'&page=' + num,
      complete: function (res) {
        if (res.data.code == '200') {
          var course = _this.data.goumaijilu.concat(res.data.data.buy_list);
          _this.setData({
            goumaijilu: course,
            start: num
          })
        }
      }
    })
  },
  upper: function () {
    console.log("下拉了....")
    //获取用户Y轴下拉的位移
    this.onLoad();
  },
  start: function (e) {
    var startPoint = e.touches[0]
    var clientY = startPoint.clientY;
    this.setData({
      clientY: clientY,
      refreshHeight: 0
    })
  },
  end: function (e) {
    var endPoint = e.changedTouches[0]
    var y = (endPoint.clientY - this.data.clientY) * 0.6;
    if (y > 50) {
      y = 50;
    }
    this.setData({
      refreshHeight: y
    })
  },
  move: function (e) {
    console.log("下拉滑动了...")
  },
  OnTouch: function (e) {
    var con = e.target.dataset.id;
    app.globalData.selectId = con;
    console.log(app.globalData.selectId);
    wx.switchTab({
      url: '/pages/course/course',  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
    })
  },

  loading: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
  },
  refresh: function () {
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 1000
    })
  },
})

/**
 * 旋转上拉加载图标
 */