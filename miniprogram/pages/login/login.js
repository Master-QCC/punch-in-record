const app = getApp()
const commonJs = require('../../components/utils/common')

Page({
  data: {
    canIUse: false,
    signature: 'Designed by QCC Made by QCC'
  },
  methods: {
    goHomePage: function () {
      setTimeout(function(){
        wx.switchTab({
          url: '/pages/index/index',
          success: function (e) {
            var page = getCurrentPages().pop();
            page.onLoad();
          }
        })
      },2000)
    }
  },
  onLoad: function() {
    if (wx.getUserProfile) {
      this.setData({
        canIUse: true
      })
    }
    if (app.globalData.userInfo) {
      this.methods.goHomePage()
    }
  },
  getUserProfile: function(e) {
    this.login()
    this.methods.goHomePage()
  },
  onShareAppMessage() {
    return {
      title: '看看我们的小日子',
      path: '/pages/index/index',
      imageUrl: '../../images/shareApp.png'
    }
  },
  login: function () {
    commonJs.login();
  }
})
