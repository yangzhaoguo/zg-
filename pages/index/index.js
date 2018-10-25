// pages/my/my.js
var Dec = require('../../utils/public.js');//引用封装好的加密解密js
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var user = wx.getStorageSync('user');
    if (user === '') {
      wx.switchTab({
        url: '/pages/my/my'
      })
      console.log('去登录页')
    } 
    app.globalData.selectId = 0;
    var _this = this;
    this.loading();
    wx.request({
      url: URL +'/Wx/Index',
      fail: function () {
        // fail
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
          app.globalData.songRankList = res.data.data.daytalk.daytalk_data
          _this.setData({
            daytalk: res.data.data.daytalk,
            freeVideo: res.data.data.freevideo,
            boutiqueVideo: res.data.data.boutique
          })      
        }
      }
     
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
    app.globalData.audioIndex = e.currentTarget.dataset.id;
    console.log(e.currentTarget.dataset.id);
    app.globalData.songInfo = e.currentTarget.dataset.data;
    app.globalData.sign = parseInt(e.currentTarget.dataset.sign, 10);
    wx.setStorageSync('audioIndex', parseInt(e.currentTarget.dataset.id, 10));
    wx.navigateTo({
      url: '/pages/audio-details/audesc?type=1',
    })

  },


  jumpBtn:function(options)
  {
    wx.navigateTo({
      url: '/pages/daytalk/daytalk',  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
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
  
})