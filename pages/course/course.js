//index.js
//获取应用实例
var app = getApp();
var URL = getApp().globalData.url;
Page({
  data: {
    course: [],
    windowHeight: 0,//获取屏幕高度
    refreshHeight: 0,//获取高度
    refreshing: false,//是否在刷新中
    refreshAnimation: {}, //加载更多旋转动画数据
    clientY: 0,//触摸时Y轴坐标
    start: 1,
    cssActive: 0,
    dataId:0
  }, 
  onShow: function (options) {
    app.cssActive = app.globalData.selectId;
    if (app.globalData.selectId==''){
      app.cssActive=0;
    }
    console.log(app.cssActive);
    this.setData({
      dataId: app.cssActive,
    }),
    // console.log('类型:' + app.cssActive);
    // console.log('全局id:' + app.globalData.selectId);
    this.loading();
    this.getTypeData(app.cssActive );
    //获取屏幕高度
  },
  onLoad: function () {
    this.refresh();
    this.onShow;
  },
  check: function (e) {
    console.log(e.target.dataset.id);
    // console.log(e.target.id);
    app.cssActive = e.target.dataset.id
    app.globalData.selectId = e.target.dataset.id;
    this.setData({
      course: [],
      start: 1,
      dataId: app.cssActive,
    }),
    this.loading();
    this.getTypeData(e.target.dataset.id);
  },
  getTypeData: function (type) {
    var _this = this; 
       wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          windowHeight: res.windowHeight
        })
        console.log("屏幕高度: " + res.windowHeight)
      }
    })
    //获取words
    wx.request({
      url: URL+'/video/VideoList?type='+type,
      complete: function (res) {
        console.log(res.data.data.list);
        if (res.data.code == '200') {
          var datas = res.data.data.list;
          for (var i = 0; i < datas.length; i++) {
            if (datas[i]['clicks'] >= 10000) {
              datas[i]['clicks'] = (datas[i]['clicks'] / 10000).toFixed(2) + '万'
            }
          }  
          _this.setData({
            course: res.data.data.list
          })
        }
      }
    })
  },
  scroll: function () {
    console.log("滑动了...")
  },
  lower: function () {
    var num = this.data.start;
    var type = app.cssActive;
    console.log('第'+num+'页');
    console.log('类型:'+type);
    num++;
    console.log("加载了...")
    var _this = this;
    wx.request({
      url: URL+'/video/VideoList?type='+ type+'&page='+num,
      complete: function (res) {
        if (res.data.code == '200') {
          var course = _this.data.course.concat(res.data.data.list);
          _this.setData({
            course: course,
            start: num
          })
        }
      }
    })
  },
  upper: function () {
    console.log("下拉了....")
    //获取用户Y轴下拉的位移
    this.onLoad();
  },
  start: function (e) {
    var startPoint = e.touches[0]
    var clientY = startPoint.clientY;
    this.setData({
      clientY: clientY,
      refreshHeight: 0
    })
  },
  end: function (e) {
    var endPoint = e.changedTouches[0]
    var y = (endPoint.clientY - this.data.clientY) * 0.6;
    if (y > 50) {
      y = 50;
    }
    this.setData({
      refreshHeight: y
    })
  },
  move: function (e) {
    console.log("下拉滑动了...")
  },
  listClick: function (event) {
    wx.navigateTo({
      url: '/pages/course-details/details'
    }) 
  },
  loading: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
  },
  refresh: function () {
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 1000
    })
  },
})

/**
 * 旋转上拉加载图标
 */

