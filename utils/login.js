//最终供外面调用的方法
const app = getApp()
var URL = getApp().globalData.url;

function login(e) {
    var that = this
    wx.login({
      success: function (res) {
        var code = res.code;
        console.log(code);
        wx.getUserInfo({
          success: function (res) {
            console.log(7);
            app.globalData.userInfo = res.userInfo
            console.log(app.globalData.userInfo);
            wx.request({
              url: URL + '/Wx/WxLogin',
              data: 'code=' + code + '&rawData=' + e.detail.rawData,    //参数为键值对字符串
              method: 'POST',
              header: {
                //设置参数内容类型为x-www-form-urlencoded
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
              },
              success: function (res) {
                wx.setStorageSync('user', res.data.data.personal);
                console.log('同步保存成功')
              }
            }) 
            app.globalData.userInfo = res.userInfo
            app.globalData.hasUserInfo = true
            //平台登录
          },
          fail: function (res) {
            console.log(8);
            console.log(res);
            app.globalData.userInfo = res.userInfo
            app.globalData.hasUserInfo = false
          }
        })
      }
    })
}
//最下面一定要加上你自定义的方法（作用：将模块接口暴露出来），否则会报错：util.trim is not a function;
module.exports = {
  login: login
}