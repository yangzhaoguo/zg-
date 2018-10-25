//app.js
var app = getApp();
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  globalData: {
    userInfo: null,
    selectId:"",
    courseId: '',
    songInfo: '',
    songRankList:[],
    newSongList: [],
    sign: 1,    //标识
    audioIndex: 0,  
    url: "https://api.yixiansheng.com/ApiConsole"
  },
 
})