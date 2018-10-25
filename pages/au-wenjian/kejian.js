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
    console.log(options.type);
    app.video_id = options.id;
    app.course_id = options.course_id;

    console.log('视频id：' + app.video_id);
    console.log('课程id：' + app.course_id);
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
            console.log(article);

            WxParse.wxParse('article', 'html', article, that, 5);
            that.setData({
              video: res.data.data,
            })
          }
        }
      })
    }
   

  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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
      duration: 1000
    })
  },

})