const app = getApp()
var URL = getApp().globalData.url;
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    getUserInfoFail: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log(wx.getStorageSync('user'));
    if (app.globalData.userInfo) {
      console.log(1)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else {
      console.log(3)
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        fail: res => {
          console.log(4);
          this.setData({
            getUserInfoFail: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(5);
    console.log(e)
    this.login(e)
    if (e.detail.userInfo) {
      this.login(e);
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    } else {
      this.openSetting();
    }
  },
  login: function (e) {
    console.log(111)
    var that = this
    wx.login({
      success: function (res) {
        var code = res.code;
        console.log(code);
        wx.request({
          url: URL+'/Wx/WxLogin',
          data: 'code=' + code + '&rawData=' + e.detail.rawData,    //参数为键值对字符串
          method: 'POST',
          header: {
            //设置参数内容类型为x-www-form-urlencoded
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          success: function (res) {
            wx.setStorageSync('user', res.data.data.personal);
            console.log(res.data.data.personal)
            console.log('同步保存成功')
          },
          fail: function (res) {
            console.log(1)
            that.setData({
              getUserInfoFail: true
            })
          }
        })
        wx.getUserInfo({
          success: function (res) {         
            console.log(7);
            app.globalData.userInfo = res.userInfo
            that.setData({
              getUserInfoFail: false,
              userInfo: res.userInfo,
              hasUserInfo: true
            })
            //平台登录
          },
          fail: function (res) {
            console.log(8);
            console.log(res);
            that.setData({
              getUserInfoFail: true
            })
          }
        })
      }
    })
  },

  clearStorageSync:function(){
    wx.clearStorageSync()
  },
  
  buyLog: function () {
    wx.navigateTo({
      url: '/pages/buyjilu/goumai',
    })
  },

  //跳转设置页面授权
  openSetting: function () {
    var that = this
    if (wx.openSetting) {
      wx.openSetting({
        success: function (res) {
          console.log(9);
          //尝试再次登录
          that.login()
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