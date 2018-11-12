//index.js
//获取应用实例
var app = getApp();
var URL = getApp().globalData.url;
Page({
  data: {
    daytalks: [],
    windowHeight: 0,//获取屏幕高度
    refreshHeight: 0,//获取高度
    refreshing: false,//是否在刷新中
    refreshAnimation: {}, //加载更多旋转动画数据
    clientY: 0,//触摸时Y轴坐标
    start: 1
  },
  onShow: function () {
    var _this = this;
    //获取屏幕高度
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
      url: URL +'/Wx/DayList',
      complete: function (res) {
        console.log(res.data);
        if (res.data.code == '200') {
          _this.setData({
            daytalks: res.data.data
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
    num++;
    console.log('第' + num + '页');
    console.log("加载了...")
    var _this = this;
    wx.request({
      url: URL +'/Wx/DayList?page=' + num,
      complete: function (res) {
        if (res.data.code == '200') {
          var daytalks = _this.data.daytalks.concat(res.data.data);
          _this.setData({
            daytalks: daytalks,
            start: num
          })
        }
      }
    })
  },
  upper: function () {
    console.log("下拉了....")
    //获取用户Y轴下拉的位移
    console.log(this.data.refreshing)
    if (this.data.refreshing) return;
    this.setData({ refreshing: true });
    updateRefreshIcon.call(this);
    var _this = this;
    wx.request({
      url: URL +'/Wx/DayList',
      complete: function (res) {
        if (res.data.code == '200') {
          setTimeout(function () {
            _this.setData({
              daytalks: res.data.data
            })
          }, 2000)
        }
        setTimeout(function () {
          _this.setData({
            refreshing: false
          })
        }, 2500)
      }
    })
  },
  videoTo: function (e) {
    var user = wx.getStorageSync('user');
    if (!user) {
      app.globalData.audioIndex = e.currentTarget.dataset.id;
      app.globalData.songInfo = e.currentTarget.dataset.data;
      app.globalData.sign = parseInt(e.currentTarget.dataset.sign, 10);
      wx.navigateTo({
        url: '/pages/audio-details/audesc?type=1',
      })
    } else {
      app.globalData.songRankList = e.currentTarget.dataset.data
      app.globalData.audioIndex = e.currentTarget.dataset.id;
      app.globalData.songInfo = e.currentTarget.dataset.data;
      app.globalData.sign = parseInt(e.currentTarget.dataset.sign, 10);
      app.globalData.teacher_name = '';
      wx.setStorageSync('audioIndex', parseInt(e.currentTarget.dataset.id, 10));
      wx.navigateTo({
        url: '/pages/audio-details/audesc?type=1',
      })
    }

  },
  move: function (e) {
    console.log("下拉滑动了...")
  }
})

/**
 * 旋转上拉加载图标
 */

