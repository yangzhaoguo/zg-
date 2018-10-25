var app = getApp()
var URL = getApp().globalData.url;
import WxParse from '../../wxParse/wxParse.js'
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
  },

  onLoad: function (options) {
    var user = wx.getStorageSync('user'); 
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
          winHeight: res.windowHeight
        });
      }
    });
    wx.request({
      url: URL + '/Wx/VideoChapter?chapter_id=' + app.video_id + '&member_id=' + user.member_id,
      success: function (res) {
        console.log(res.data.data);
        if (res.data.code == '200') {
          var datas = res.data.data;
          var article = res.data.data.courseware;
          WxParse.wxParse('article', 'html', article, that, 5);
          that.setData({
            video: res.data.data,
            video_url: res.data.data.high_url,
            video_id: app.video_id
          })
          wx.request({
            url: URL + '/Wx/Ncatalog?course_id=' + app.course_id + '&member_id=' + user.member_id,
            success: function (res) {
              console.log(res.data.data);
              if (res.data.code == '200') {
                var datas = res.data.data;
                that.setData({
                  videoLog: res.data.data
                })
              }
            }
          })
        }
      }
    })

  },

  clickUrl: function (e) {
    var that =this;
    console.log(e);
    var video_id = e.currentTarget.dataset.id;
    var course_id = e.currentTarget.dataset.course_id;
    var v_url = e.currentTarget.dataset.url;
    console.log('课程id：'+course_id);
    console.log("视频id："+video_id);
    console.log("视频id：" + v_url);
    // wx.redirectTo({
    //   url: '/pages/course-Play/play?id=' + video_id + '&course_id=' + course_id,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
    // })
    that.setData({ 
      video_url: v_url,
      video_id: video_id
    });
  },


  // 滑动切换tab 

  bindChange: function (e) {

    var that = this;

    that.setData({ currentTab: e.detail.current });
  },
  // 点击tab切换 
  swichNav: function (e) {
    var that = this;
    console.log(e)
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      if (e.target.dataset.current == 1) {
        var video_id = e.target.dataset.course_id;
        wx.request({
          url: URL + '/Wx/Ncatalog?course_id=' + video_id + '&member_id=' + user.member_id,
          complete: function (res) {
            console.log(res.data.data);
            if (res.data.code == '200') {
              that.setData({
                videoLog: res.data.data,
              })
            }
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

})