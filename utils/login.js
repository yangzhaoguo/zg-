//最终供外面调用的方法
function login() {
  console.log('logining..........');
  //调用登录接口
  wx.login({
    success: function (e) {
      console.log('wxlogin successd........');
      var code = e.code;
      wx.getUserInfo({
        success: function (res) {
          console.log('wxgetUserInfo successd........');
          var encryptedData = encodeURIComponent(res.encryptedData);
          thirdLogin(code, encryptedData, res.iv);//调用服务器api
        }
      })
    }
  });
}

function thirdLogin(code, encryptedData, iv) {
  var url = "";
  var params = new Object();
  params.code = code;
  params.encryptedData = encryptedData;
  params.iv = iv;

  buildRequest(new Object(), url, params, {
    onPre: function (page) { },
    onSuccess: function (data) {
      console.log('my  login successd........');
      console.log(data);
      getApp().globalData.session_id = data.session_id;
      getApp().globalData.uid = data.uid;
      getApp().globalData.isLogin = true;
    },
    onError: function (msgCanShow, code, hiddenMsg) {
    }
  }).send();
}