
var app = getApp();
var URL = getApp().globalData.url;
import WxParse from '../../wxParse/wxParse.js'
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
    
    numData: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十', '十一', '十二', '十三', '十四', '十五', '十六'],
    // 展开折叠
    selectedFlag: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
  },

  onLoad: function (options) {
    var that = this;
    app.video_id = options.id;
    console.log('课程id：' + app.video_id);
    var user = wx.getStorageSync('user'); 
    // 获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          
        });
      }
    });
    wx.request({
      url: URL + '/Wx/Ncatalog?course_id=' + app.video_id + '&member_id=' + user.member_id,
      success: function (res) {
        if (res.data.code == '200') {
          var datas = res.data.data.ncatalog;
            that.setData({
              videoLog: res.data.data,
          });
          app.globalData.songRankList = datas
          wx.request({
            url: URL + '/Wx/Details?course_id=' + app.video_id + '&member_id=' + user.member_id,
            success: function (res) {
              var article = res.data.data.courseware;          
              WxParse.wxParse('article', 'html', article, that, 5); 
              if (res.data.code == '200') {
                that.setData({
                  video: res.data.data,
                })
              }
            }
          })
        }
      }
    })
  },

  /* 支付   */
  pay: function (param) { 
    var user = wx.getStorageSync('user'); 
    var openid = user.weixin_code; 
    var course_id = param.currentTarget.dataset.course_id;
    var course_name = param.currentTarget.dataset.course_name;
    var price = param.currentTarget.dataset.price;
    wx.request({
      url: URL+'/Wx/Wxpay',//改成你自己的链接
      data:{
        'course_id': course_id,
        'member_id': user.member_id,
        'course_name': course_name,
        'price': price*100,
         'openid':openid
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        console.log('调起支付');
        if(res.data.code==200){
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': 'MD5',
            'paySign': res.data.data.paySign,
            'success': function (res) {
              console.log('success');
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 3000,
                mask: false,  //是否显示透明蒙层，防止触摸穿透，默认：false
                success: function (){
                  wx.navigateTo({
                    url: '/pages/learn/learn',
                  })
                }, //接口调用成功的回调函数
                fail: function () { },  //接口调用失败的回调函数
                complete: function () { } //接口调用结束的回调函数
              });
            },
            'fail': function (res) {
              console.log('fail');
            },
            'complete': function (res) {
              console.log('complete');
            }
          });
        }else{
          wx.showToast({
            title: res.data.info,
            icon: 'loding',
            duration: 3000,
            mask: false,  //是否显示透明蒙层，防止触摸穿透，默认：false
          });
        };
      },
      fail: function (res) {
        console.log(res.data)
      }
    });
  },

  videlist: function (e) {
    var video = this.data.videoLog;
    console.log(video);
    var thetype = e.currentTarget.dataset.type;
    var course_id = e.currentTarget.dataset.course_id;
    var id = e.currentTarget.dataset.id;
    var pic = e.currentTarget.dataset.pic;
    var is_active = e.currentTarget.dataset.is_active;
    console.log(pic);
    if(video.is_buy==1)
    {
      if (thetype == 2) {
        wx.navigateTo({
          url: '/pages/course-Play/play?id=' + id + '&course_id=' + course_id,
        })
      } else {
        app.globalData.audioIndex = e.currentTarget.dataset.tid;
        app.globalData.sign = parseInt(e.currentTarget.dataset.sign, 10);
        wx.setStorageSync('audioIndex', parseInt(e.currentTarget.dataset.tid, 10));
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
            url: '/pages/course-Play/play?id=' + id + '&course_id=' + course_id,
          })
        } else {
          app.globalData.audioIndex = e.currentTarget.dataset.tid;
          app.globalData.sign = parseInt(e.currentTarget.dataset.sign, 10);
          wx.setStorageSync('audioIndex', parseInt(e.currentTarget.dataset.tid, 10));
          wx.navigateTo({
            url: '/pages/audio-details/audesc?type=2&id=' + id + '&course_id=' + course_id + '&pic=' + pic,
          })
        }
      }else{
        if (is_active==1)
        {
          if (thetype == 2) {
            wx.navigateTo({
              url: '/pages/course-Play/play?id=' + id + '&course_id=' + course_id,
            })
          } else {
            app.globalData.audioIndex = e.currentTarget.dataset.tid;
            app.globalData.sign = parseInt(e.currentTarget.dataset.sign, 10);
            wx.setStorageSync('audioIndex', parseInt(e.currentTarget.dataset.tid, 10));
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

    var that = this;

    that.setData({ currentTab: e.detail.current });

  },

  // 点击tab切换 

  swichNav: function (e) {

    var that = this;
    var video_id = app.video_id;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
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