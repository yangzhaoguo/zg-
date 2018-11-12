// pages/my/my.js

var app = getApp()
var URL = getApp().globalData.url;
import WxParse from '../../wxParse/wxParse.js'
Page({

  data: {
    dataId: 0,
    videoLog: [],
    video: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    app.video_id = options.id;
    app.course_id = options.course_id;
    // 获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
        });
      }
    });
    if (options.type==2){
      wx.request({
        url: URL + '/Wx/VideoChapter?chapter_id=' + app.video_id,
        success: function (res) {
          console.log(res.data.data);
          if (res.data.code == '200') {
            var article = res.data.data.courseware;
            console.log(article);

            WxParse.wxParse('article', 'html', article, that, 5);
            that.setData({
              video: res.data.data,
            })
          }
        }
      })
    }else{
      wx.request({
        url: URL + '/Wx/Daytails?talk_id=' + app.video_id,
        success: function (res) {
          console.log(res.data.data);
          if (res.data.code == '200') {
            var article = res.data.data.courseware;
            WxParse.wxParse('article', 'html', article, that, 5);
            that.setData({
              video: res.data.data,
            })
          }
        }
      })
    }   
    this.loading();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  loading: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 2500
    })
  },

})