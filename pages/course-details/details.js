
var app = getApp();
var URL = getApp().globalData.url;
import WxParse from '../../wxParse/wxParse.js';
var Orderpay = require('../../utils/pay.js');//引用封装好的加密解密js
var user = wx.getStorageSync('user'); 
Page({
  data: {
    // 页面配置  
    winWidth: 0,
    winHeight: 0,
    // tab切换 
    currentTab: 1,
    video:[],
    videoLog:[],
    dataId:'',
    video_id:'',
    systemInfo: {},  
    numData: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十', '十一', '十二', '十三', '十四', '十五', '十六'],
    // 展开折叠
    selectedFlag: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
  },
  onLoad: function (options) {
    var that = this;
    var user = wx.getStorageSync('user'); 
    if (user === '') {
      wx.switchTab({
        url: '/pages/my/my'
      })
      console.log('去登录页')
    } 
    wx.request({
      url: URL + '/Wx/Ncatalog?course_id=' + options.id + '&member_id=' + user.member_id,
      success: function (res) {
        if (res.data.code == '200') {
          var datas = res.data.data;
            that.setData({
              videoLog: datas,
          });
          if (datas.course_type==2)
          {
            app.globalData.videoList = datas;
          }else{
            app.globalData.songRankList = res.data.data.ncatalog;
            app.globalData.teacher_name = res.data.data.teacher_nickname;
          }
        }
      }
    })
  },

  pay:function(e)
  {
    Orderpay.pay(e);
  },

  videlist: function (e) {
    var video = this.data.videoLog;
    var thetype = e.currentTarget.dataset.type;
    var course_id = e.currentTarget.dataset.course_id;
    var id = e.currentTarget.dataset.id;
    var pic = e.currentTarget.dataset.pic;
    var is_active = e.currentTarget.dataset.is_active;
    var play_url = e.currentTarget.dataset.url;
    app.globalData.audioIndex = e.currentTarget.dataset.tid;
    app.globalData.sign = parseInt(e.currentTarget.dataset.sign, 10);
    wx.setStorageSync('audioIndex', parseInt(e.currentTarget.dataset.tid, 10));
    if(video.is_buy==1)
    {
      if (thetype == 2) {
        wx.navigateTo({
          url: '/pages/course-Play/play?high_url=' + play_url+'&id=' + id + '&course_id=' + course_id,
        })
      } else {
        app.globalData.pic = pic;
        wx.navigateTo({
          url: '/pages/audio-details/audesc?type=2&id=' + id + '&course_id=' + course_id + '&pic='+ pic,
        })
      }
    }else
    {
      if(video.price==0)
      {
        if (thetype == 2) {       
          wx.navigateTo({
            url: '/pages/course-Play/play?high_url=' + play_url +'&id=' + id + '&course_id=' + course_id,
          })
        } else {
          app.globalData.pic = pic;
          wx.navigateTo({
            url: '/pages/audio-details/audesc?type=2&id=' + id + '&course_id=' + course_id + '&pic=' + pic,
          })
        }
      }else{
        if (is_active==1)
        {
          if (thetype == 2) {
            
            wx.navigateTo({
              url: '/pages/course-Play/play?high_url=' + play_url +'&id=' + id + '&course_id=' + course_id,
            })
          } else {
            app.globalData.pic = pic;
            wx.navigateTo({
              url: '/pages/audio-details/audesc?type=2&id=' + id + '&course_id=' + course_id + '&pic=' + pic,
            })
          }
        }else
        {
          this.pay(e);
        }
      }
    }
    
  },

  // 滑动切换tab 

  bindChange: function (e) {
    var user = wx.getStorageSync('user');
    var that = this;
    var course_id = e.target.dataset.course_id;
    if (e.detail.current  === e.target.dataset.current) {
      return false;
    } else {
      if (e.target.dataset.current == 1) {
        wx.request({
          url: URL + '/Wx/Details?course_id=' + course_id + '&member_id=' + user.member_id,
          success: function (res) {
            console.log(res.data.data);
            var article = res.data.data.courseware;
            WxParse.wxParse('article', 'html', article, that, 5);
            if (res.data.code == '200') {
              that.setData({
                video: res.data.data,
              })
            }
          },
          fail: res => {
            this.loading();
          }        
        })
      }
      that.setData({
        currentTab: e.detail.current 
      })
    }

  },

  // 点击tab切换 

  swichNav: function (e) {
    var user = wx.getStorageSync('user'); 
    var that = this;
    var course_id = e.target.dataset.course_id;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      if (e.target.dataset.current==0){
        wx.request({
          url: URL + '/Wx/Details?course_id=' + course_id + '&member_id=' + user.member_id,
          success: function (res) {
            console.log(res.data.data);
            var article = res.data.data.courseware;
            WxParse.wxParse('article', 'html', article, that, 5);
            if (res.data.code == '200') {
              that.setData({
                video: res.data.data,
              })
            }
          },
          fail: res => {
            this.loading();
          }   
        })
      }
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
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

  loading: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 2500
    })
  },

})