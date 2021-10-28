const commonJs = require('../../components/utils/common')
const db = wx.cloud.database()

Page({
  data: {
    loginText:'登录',
    showLogin: false,
    imagePath: 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/gif/hello.gif'
  },
  login() {
    wx.redirectTo({
      url: '../login/login'
    })
  },
  onShareAppMessage() {
    return {
      title: '看看我们的小日子',
      path: '/pages/index/index',
      imageUrl: '../../images/shareApp.png'
    }
  },
  onShow() {
    this.selectComponent('#punch-today-component').refreshData();
  },
  onLoad() {
    const that = this;
    commonJs.allowShare();
    const date = commonJs.getToday().split(' ')[0];
    if (this.data.showLogin) {
      this.selectComponent('#punch-today-component').refreshUserDetial();
    }
    
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权
          that.setData({
            showLogin: false
          })
        } else {
          that.setData({
            showLogin: true
          })
        }
      },
      fail (e) {
        that.setData({
          showLogin: true
        })
      }
    });

    db.collection('star').add({
      data: {
        _id: date,
        todayStar: 2,
        lunchStar: false,
        dinnerStar: false
      },
      success: function(res) {
        console.log(res)
      }
    })
  }
})
