const app = getApp()
var util = require('../../utils/login.js');
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function () {
    var user =wx.getStorageSync('user');
    console.log(this.hasUserInfo);
    if (!user) {
      console.log(1)
      console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: false,
      })
    } else {
      console.log(3)
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          app.globalData.hasUserInfo = true
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        fail: res => {
          console.log(4);
          this.setData({
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(5);
    console.log(e)
    util.login(e)
    if (e.detail.userInfo) {
      util.login(e);
      app.globalData.userInfo = e.detail.userInfo
      app.globalData.hasUserInfo = true
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    } else {
      this.openSetting();
    }
  }, 

  clearStorageSync:function(){
    wx.clearStorageSync()
  },
  
  buyLog: function () {
    if (wx.getStorageSync('user')=="")
    {
      wx.showToast({
        title: "请登录",
        duration: 3000,
        mask: false,  //是否显示透明蒙层，防止触摸穿透，默认：false
      });
      this.onLoad();
    }else{
    wx.navigateTo({
      url: '/pages/buyjilu/goumai',
    })
    }
  },

  //跳转设置页面授权
  openSetting: function () {
    var that = this
    if (wx.openSetting) {
      wx.openSetting({
        success: function (res) {
          console.log(9);
          //尝试再次登录
          util.login()
        }
      })
    } else {
      console.log(10);
      wx.showModal({
        title: '授权提示',
        content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
      })
    }
  }
})