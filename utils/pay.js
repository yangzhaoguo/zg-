/* 支付   */

const app = getApp();
var URL = getApp().globalData.url;


 function pay(param) {
  var user = wx.getStorageSync('user');
  var openid = user.weixin_code;
  var course_id = param.currentTarget.dataset.course_id;
  var course_name = param.currentTarget.dataset.course_name;
  var price = param.currentTarget.dataset.price;
  wx.getSystemInfo({
    success: function (res) {
      if (res.platform == "ios") {
        wx.showToast({
          title: "ios用户请在[易先生APP]内购买！",
          icon: 'none',
          mask: false,  //是否显示透明蒙层，防止触摸穿透，默认：false
          duration: 3000,
        });
      } else {
        wx.request({
          url: URL + '/Wx/Wxpay',//改成你自己的链接
          data: {
            'course_id': course_id,
            'member_id': user.member_id,
            'course_name': course_name,
            'price': price * 100,
            'openid': openid
          },
          method: 'GET',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log('调起支付');
            if (res.data.code == 200) {
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
                    success: function () {
                      wx.switchTab({
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
            } else {
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
      }
    }
  })
}
//最下面一定要加上你自定义的方法（作用：将模块接口暴露出来），否则会报错：util.trim is not a function;
module.exports = {
  pay: pay
}