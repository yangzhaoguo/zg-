var app = getApp()
var URL = getApp().globalData.url;
import WxParse from '../../wxParse/wxParse.js'

var Orderpay = require('../../utils/pay.js');//引用封装好的加密解密js
var user = wx.getStorageSync('user'); 
Page({

  data: {
    // 页面配置  
    winWidth: 0,
    winHeight: 0,
    // tab切换 
    currentTab: 1,
    video: [],
    videoLog: [],
    dataId: '',
    video_id: '',
    course_id: '',
    video_url:'',
    numData: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十', '十一', '十二', '十三', '十四', '十五', '十六'],
    // 展开折叠
    selectedFlag: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    audioIndex:0
  },

  onLoad: function (options) {
    var user = wx.getStorageSync('user'); 
    var that = this;
    app.video_id = options.id;
    app.course_id = options.course_id;
    app.video_url = options.high_url;
    // 获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });  
    wx.request({
      url: URL + '/Wx/Ncatalog?course_id=' + app.course_id + '&member_id=' + user.member_id,
      success: function (res) {
        if (res.data.code == '200') {
          var datas = res.data.data;
          console.log('视频id'+app.video_id);
          console.log("视频地址" + app.video_url);
          that.setData({
            videoLog: res.data.data,
            video_url: options.high_url,
            video_id: app.video_id,
            audioIndex: app.globalData.audioIndex
          })
        }
      }
    })
  },

  pay: function (e) {
    Orderpay.pay(e);
  },

  clickUrl: function (e) {
    var that =this;
    var video_id = e.currentTarget.dataset.id;
    var course_id = e.currentTarget.dataset.course_id;
    var v_url = e.currentTarget.dataset.url;
    var audioIndex = e.currentTarget.dataset.tid;
    // wx.redirectTo({
    //   url: '/pages/course-Play/play?id=' + video_id + '&course_id=' + course_id,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
    // })
    that.setData({ 
      video_url: v_url,
      video_id: video_id,
      audioIndex: audioIndex
    });
    console.log(audioIndex);
    app.globalData.audioIndex = audioIndex
  },

  // bindtimeupdate: function (res) {
  //   console.log(res)//查看正在播放相关变量
  //   console.log("播放到第" + res.detail.currentTime + "秒")
  // },
  // bindended: function (res) {//播放中函数，查看当前播放时间等
  //   console.log(res)
  //   console.log("播放完了")//查看正在播放时间，以秒为单位
  // },


  // 滑动切换tab 

  bindChange: function (e) {
    var that = this;
    console.log(e)
    var video_id = e.target.dataset.video_id;
    if (e.detail.current === e.target.dataset.current) {
      return false;
    } else {
      if (e.target.dataset.current == 1) {
        wx.request({
          url: URL + '/Wx/VideoChapter?chapter_id=' + video_id + '&member_id=' + user.member_id,
          success: function (res) {
            console.log(res.data.data);
            if (res.data.code == '200') {
              var article = res.data.data.courseware;
              WxParse.wxParse('article', 'html', article, that, 5);
              that.setData({
                video_id: video_id,
              })
            }
          },
          fail: res => {
            this.loading();
          } 
        })
      }
    }
    that.setData({
      currentTab: e.detail.current 
    })
  },
  // 点击tab切换 
  swichNav: function (e) {
    var that = this;
    console.log(e)
    var video_id = e.target.dataset.video_id;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      if (e.target.dataset.current == 0) {  
        wx.request({
          url: URL + '/Wx/VideoChapter?chapter_id=' + video_id + '&member_id=' + user.member_id,
          success: function (res) {
            console.log(res.data.data);
            if (res.data.code == '200') {
              var article = res.data.data.courseware;
              WxParse.wxParse('article', 'html', article, that, 5);
              that.setData({
                video_id: video_id,
              })
            }
          } ,
          fail: res => {
            this.loading();
          }  
        })
      }
    }
    that.setData({
      currentTab: e.target.dataset.current,
    })
  },
  // 折叠面板
  changeToggle: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index);
    if (this.data.selectedFlag[index]) {
      this.data.selectedFlag[index] = false;
    } else {
      this.data.selectedFlag[index] = true;
    }
    console.log(this.data.selectedFlag);
    this.setData({
      selectedFlag: this.data.selectedFlag
    })
  },

  PlayNext:function(e){
    
    var that=this; 
    var datas = app.globalData.videoList.ncatalog
    var list = app.globalData.videoList;
    console.log('视频播放列表'+list);
    var indexId= app.globalData.audioIndex+1

    for (var i = 0; i < datas.length; i++) {
      if (list.is_buy == 1 || list.price==0 )
      {
        if (indexId == i) {
          console.log(123)
          that.setData({
            video_url: datas[i]['high_url'],
            video_id: datas[i]['id'],
            audioIndex: i
          })
          app.globalData.audioIndex = i
        }
      }else{
        if (indexId == i) {
          if (datas[i]['is_active'] == 0) {
          } else {
            that.setData({
              video_url: datas[i]['high_url'],
              video_id: datas[i]['id'],
              audioIndex: i
            })
            app.globalData.audioIndex = i
          }
        }
      } 
    }
  },

  loading: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 2500
    })
  },

})