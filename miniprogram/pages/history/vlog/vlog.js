const app = getApp()
const db = wx.cloud.database()
const _ = db.command;
const commonJs = require('../../../components/utils/common')
Page({
  data: {
    videoList: [],
    sortList: [],
    showUploadBtn: false,
    openUpload: false,
    closeUpload: false,
    uploadTitleLabel: '添加Vlog',
    detialTitleLabel: '标题：',
    detialDateLabel: '日期：',
    submitLabel: '添加',
    selected: false,
    userVideoPath: ''
  },
  // 开关添加窗口
  openUploadBox () {
    if (!this.data.openUpload) {
      this.setData({
        openUpload: true,
        closeUpload: false
      })
    }
  },
  closeUploadBox () {
    if (this.data.openUpload) {
      this.setData({
        openUpload: false,
        closeUpload: true,
        selected: false,
        titleValue: '',
        dateValue: '',
        userVideoPath: ''
      })
    }
  },
  // 提交表单
  submitForm (newData) {
    db.collection('history').where({'_id': 'Eileen'}).update({
      data: {
        videoList: _.unshift(newData)
      }
    }).then(res => {
      console.log(res);
      app.globalData.history.videoList.unshift(newData);
      this.getVideoList();
    }).catch(err => {
      console.log(err);
    })
  },
  selectVideo () {
    const that = this;
    wx.chooseMedia({
      success(res) {
        console.log(res);
        that.setData({
          userVideoPath: res.tempFilePath,
          userImagePath: res.tempFiles[0].thumbTempFilePath,
          selected: true
        })
      }
    })
  },
  uploadToCloud () {
    if (!app.globalData.isLogin) {
      wx.showModal({
        title: '登录提示',
        content: '要先登录才能使用哦~',
        showCancel: false,
        confirmColor: '#ffbe46',
        success (res) {
          wx.redirectTo({
            url: '../login/login'
          })
        }
      })
      return
    }
    
    const filePath = this.data.userVideoPath;
    const cloudPath = "vlog/" + new Date().getTime() +"-"+ Math.floor(Math.random() * 1000);
    const newData = {
      title: this.data.titleValue,
      src: 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/' + cloudPath,
      danmuList: [],
      playNumber: 0,
      thumbsNumber: 0,
      itemNumber: null,
      time: this.data.dateValue
    }
    //上传视频
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        console.log('[上传文件] 成功：', res)
        wx.showLoading({
          title: '添加成功',
          mask: true
        })
        this.submitForm(newData);
        this.closeUploadBox();
      },
      fail: e => {
        console.error('[上传文件] 失败：', e)
        wx.showToast({
          icon: 'none',
          title: '上传失败',
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  doUpload () {
    // check select video
    if (!this.data.userVideoPath) {
      wx.showModal({
        title: '还未选择视频',
        content: '视频没选，添加个log？',
        confirmColor: '#ffbe46',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else if (this.data.titleValue == '' || this.data.dateValue == '') {
      wx.showModal({
        title: '确认添加？',
        content: '还有未填，真的没什么可写了？',
        confirmColor: '#ffbe46',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            this.uploadToCloud()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      this.uploadToCloud()
    }
  },
  bindDateChange (e) {
    this.setData({
      dateValue: e.detail.value
    })
  },
  getVideoList () {
    this.setData({
      videoList: []
    })
    const videoList = app.globalData.history.videoList;
    if (videoList.length > 0) {
      this.setvideoList(videoList);
    } else {
      wx.hideLoading();
      wx.showToast({
        title: '暂无vlog可以观看',
        icon: 'fail',
        duration: 2000
      })
    }
  },
  compare (prop) {
    return function (obj1, obj2) {
        var val1 = new Date(obj1[prop]);
        var val2 = new Date(obj2[prop]);
        if (val1 < val2) {
            return 1;
        } else if (val1 > val2) {
            return -1;
        } else {
            return 0;
        }            
    } 
  },
  setvideoList (videoList) {
    const videoArryLength = videoList.length;
    for(let i = 0; i < videoArryLength; i++) {
      videoList[i].itemNumber = i;
    }
    this.data.sortList = commonJs.cloneObj(videoList);
    this.data.sortList.sort(this.compare('time'));
    this.setData({
      videoList: this.data.sortList
    })
    wx.hideLoading();
  },
  onLoad() {
    wx.showLoading({
      title: '加载中'
    });
    this.getVideoList();
  },
  onUnload () {
    app.globalData.previousVideo = ''
  },
  onShareAppMessage() {
    return {
      title: '看看我们的小日子',
      path: '/pages/index/index',
      imageUrl: '../../../images/shareApp.png'
    }
  },
  onReady() {
    if (app.globalData.userInfo && (app.globalData.userInfo.user === 'man' || app.globalData.userInfo.user === 'woman')) {
      this.setData({
        showUploadBtn: true
      });
    }
  }
})
