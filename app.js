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
    selectId:"",
    courseId: '',
    songInfo: '',
    songRankList:[],
    newSongList: [],
    videoList:[],
    videoData: [],
    sign: 1,    //标识
    audioIndex: 0,  
    hasUserInfo:'',
    songData:{
      standard_url: '',
      songPic: '',
      songName: '',
      singer: ''
    },
    userInfo: {},
    pic:'',
    hasUserInfo: false,
    getUserInfoFail: false,
    showView: false, //是否显示迷你播放
    playStatus: false,//是否显示迷你播放
    teacher_name:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    url: "https://api.yixiansheng.com/ApiConsole"
  }, 
})