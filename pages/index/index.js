// pages/my/my.js
var stotime = require('../../utils/music.js');//引用封装好的加密解密js
var app = getApp()
var URL = getApp().globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataId: 0,
    daytalk: [],
    freeVideo: [],
    boutiqueVideo: [],
    showView: false,
    playStatus:false,
    songData:[],
    totalTime: 0,
    VideoPic: '',
    teacher_name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var _this = this;
    app.globalData.selectId = 0;
    var songData = app.globalData.songData;
    _this.onAudioState();
    wx.request({
      url: URL +'/Wx/Index',
      fail: function () {
        this.loading();
      },
      complete: function (res) {
        console.log(res.data.data);
        if (res.data.code == '200') {
          var datas = res.data.data.boutique.boutique_data;
          var datass = res.data.data.freevideo.freevideo_data;
          for (var i = 0; i < datas.length; i++) {
            if (datas[i]['clicks']>=10000){
              datas[i]['clicks']=(datas[i]['clicks']/10000).toFixed(2)+'万'
            }
          }  
          for (var i = 0; i < datass.length; i++) {
            if (datass[i]['clicks'] >= 10000) {
              datass[i]['clicks'] = (datass[i]['clicks'] / 10000).toFixed(2) + '万'
            }
          } 
          _this.setData({
            daytalk: res.data.data.daytalk,
            freeVideo: res.data.data.freevideo,
            boutiqueVideo: res.data.data.boutique
          })      
        }
      } 
    })
    _this.setData({
      songData:songData,
      VideoPic: app.globalData.pic,
      teacher_name: app.globalData.teacher_name
    })       
  },

  OnTouch: function (e) {
    var con = e.target.dataset.id;
    app.globalData.selectId=con;
    console.log(app.globalData.selectId);
    wx.navigateTo({
      url: '/pages/course/course',  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
    })
  },

  videoTo: function (e) {
    var user = wx.getStorageSync('user'); 
    if(!user)
    {
      wx.navigateTo({
        url: '/pages/audio-details/audesc?type=1',
      })
    }else{
      var daytalk = e.currentTarget.dataset.item;
      app.globalData.songRankList = e.currentTarget.dataset.data;
      app.globalData.audioIndex = e.currentTarget.dataset.id;
      app.globalData.sign = parseInt(e.currentTarget.dataset.sign, 10); 
      app.globalData.pic = daytalk.img;
      app.globalData.teacher_name = '';
      app.globalData.songData= {
        songId: daytalk.id,
        standard_url: daytalk.standard_url,
        songPic: daytalk.img,
        songName: daytalk.title,
      },     
      wx.setStorageSync('audioIndex', parseInt(e.currentTarget.dataset.id, 10));
      wx.navigateTo({
        url: '/pages/audio-details/audesc?type=1',
      })
      this.setData({
        showView: true,
        playStatus: true
      })

    }    
  },

/**
 * 监测音乐播放
 */
  onAudioState: function () {
    let that = this;
    wx.onBackgroundAudioPlay(function () {
      // 当 wx.playBackgroundAudio() 执行时触发
      // 改变 coverImg 和 播放状态
      that.setData({ playStatus: true, showView: true});
      console.log("on play");
    });
    wx.onBackgroundAudioPause(function () {
      // 当 wx.pauseBackgroundAudio() 执行时触发
      // 仅改变 播放状态
      that.setData({ playStatus: false, showView: true});
      console.log("on pause");
    });

    wx.onBackgroundAudioStop(function () {
      // 当 音乐自行播放结束时触发
      // 改变 coverImg 和 播放状态
      that.setData({playStatus: false});
      console.log("on stop");
    });

    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        console.log(123);
        console.log(res)
        let { status, duration } = res
        if (status === 1 || status === 0) {
          that.setData({
            showView: true,
            playStatus: true,
            totalTime: stotime.stotime(duration),
          })
        }
      }
    })
  },

  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: false
    })
  },

/**
 * 控制音乐播放
 */
  audioPlay:function()
  {
    if (this.data.playStatus === false) {
      wx.playBackgroundAudio();
      this.setData({
        playStatus: true,
        showView: true
      });
    } else {
      wx.pauseBackgroundAudio();
      this.setData({
        playStatus: false
      });
    }
  },

  loading: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
  },
  
})