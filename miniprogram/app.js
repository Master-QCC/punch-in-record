App({
  onLaunch: function () {
    this.globalData = {};
    this.globalData.isLogin = false;
    this.globalData.userWhiteList = [{
      openId: 'oeXeC4t-yxCUT5qkf-zoVOWz00v8',
      user: 'woman',
      phone: '18321679060'
    },{
      openId: 'oeXeC4rCuLH6gr-ldKNwvOZUoZFc',
      user: 'man',
      phone: '15800747821'
    }];
    
    wx.cloud.init({
      env:"smallthing-qcc"
    })

    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '发现新版本，是否重启应用？',
              confirmColor: '#ffbe46',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
              confirmColor: '#ffbe46'
            })
          })
        }
      })
    }
    
  }
})
