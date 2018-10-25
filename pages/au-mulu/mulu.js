// pages/my/my.js

var app = getApp()
var URL = getApp().globalData.url;
Page({

  data: {
    dataId: 0,
    videoLog: [],
    video: [],
    video_id: '',
    course_id: '',
    video_url: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;

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
          video_id: app.video_id
        });
      }
    });

    if (options.type == 2) {
      wx.request({
        url: URL + '/Wx/Ncatalog?course_id=' + app.course_id,
        success: function (res) {
          console.log(res.data.data);
          if (res.data.code == '200') {
            that.setData({
              videoLog: res.data.data.ncatalog,
              video_id: app.video_id
            })
          }
        }
      })
    }else{
      that.setData({
        videoLog: app.globalData.songRankList,
        video_id: app.video_id
      })   
    }
  },
  clickUrl: function (e) {
    var that = this;
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
  
    console.log(e.currentTarget.dataset.video_id);
    var course_id = e.currentTarget.dataset.course_id;
    app.globalData.audioIndex = e.currentTarget.dataset.video_id;
    app.globalData.sign = parseInt(e.currentTarget.dataset.sign, 10);
    wx.setStorageSync('audioIndex', parseInt(e.currentTarget.dataset.video_id, 10));
    prevPage.setData({//直接给上移页面赋值
      audioIndex: e.currentTarget.dataset.video_id,
    });
    wx.navigateBack({//返回
      delta: 1
    })
  },
  OnTouch: function (e) {
    var con = e.target.dataset.id;
    app.globalData.selectId = con;
    console.log(app.globalData.selectId);
    wx.switchTab({
      url: '/pages/course/course',  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
    })
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
})