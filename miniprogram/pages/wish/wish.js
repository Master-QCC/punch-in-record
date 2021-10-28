const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
const commonJs = require('../../components/utils/common')

Page({
  data: {
    showUploadBtn: false,
    //init number
    manFinishedNumber: 0,
    manUnfinishNumber: 0,
    womanFinishedNumber: 0,
    womanUnfinishNumber: 0,
    //init list
    manCloudList: [],
    womanCloudList: [],
    manWishList: [],
    womanWishList: [],
    //user type
    isManUser: false,
    isWomanUser: false,
    //class
    showMan: 'all',
    showWoman: 'all',
    manFinishedClass: false,
    manUnfinishedClass: false,
    womanFinishedClass: false,
    womanUnfinishedClass: false,
    displayMan: false,
    displayWoman: false,
    //pop up
    score: 0, //优先级
    starOffset: 0,
    starWidth: 0,
    openUpload: false,
    closeUpload: false,
    descriptionValue: '',
    userImageList: []
  },
  //滚动
  onPageScroll (e) { 
    this.closeUploadBox();
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
  closeUploadBox (name) {
    if (this.data.openUpload) {
      this.setData({
        openUpload: false,
        closeUpload: true,
      })
      if (name == 'clean') {
        this.setData({
          descriptionValue: '',
          score: 0,
          userImageList: []
        })
      }
    }
  },
  //检索显示
  showManFinish () {
    let value = this.data.manFinishedClass;
    this.setData({
      manFinishedClass: !value,
      manUnfinishedClass: false
    })

    if (this.data.showMan === 'all' || this.data.showMan === false) {
      this.setData({
        showMan: true
      })
    } else {
      this.setData({
        showMan: 'all'
      })
    }
  },
  showManUnfinish () {
    let value = this.data.manUnfinishedClass;
    this.setData({
      manFinishedClass: false,
      manUnfinishedClass: !value
    })

    if (this.data.showMan === 'all' || this.data.showMan === true) {
      this.setData({
        showMan: false
      })
    } else {
      this.setData({
        showMan: 'all'
      })
    }
  },
  showWomanFinish () {
    let value = this.data.womanFinishedClass;
    this.setData({
      womanFinishedClass: !value,
      womanUnfinishedClass: false
    })
    
    if (this.data.showWoman === 'all' || this.data.showWoman === false) {
      this.setData({
        showWoman: true
      })
    } else {
      this.setData({
        showWoman: 'all'
      })
    }
  },
  showWomanUnfinish () {
    let value = this.data.womanUnfinishedClass;
    this.setData({
      womanFinishedClass: false,
      womanUnfinishedClass: !value
    });

    if (this.data.showWoman === 'all' || this.data.showWoman === true) {
      this.setData({
        showWoman: false
      })
    } else {
      this.setData({
        showWoman: 'all'
      })
    }
  },
  //完成提交标记
  submitFinish (listName, index, value) {
    db.collection('wish').where({'_id': 'Eileen'}).update({
      data: {
        [listName + [index]]: {
          finished: value
        }
      }
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  },
  checkboxChange(event) {
    let index = event.currentTarget.dataset.index;
    if (app.globalData.userInfo.user === 'woman') {
      let targetItem = 'womanWishList[' + index + '].finished'
      let value = this.data.womanWishList[index].finished
      this.setData({
        [targetItem]: !value
      })
      this.submitFinish('womanWishList.', index, !value);
      this.setNumber(this.data.womanWishList, 'woman');
    } else if (app.globalData.userInfo.user === 'man') {
      let targetItem = 'manWishList[' + index + '].finished'
      let value = this.data.manWishList[index].finished
      this.setData({
        [targetItem]: !value
      })
      this.submitFinish('manWishList.', index, !value);
      this.setNumber(this.data.manWishList, 'man');
    }
  },
  //修改心愿内容
  submitManDescription (e) {
    let that = this;
    let value = e.detail.value;
    let index = e.currentTarget.dataset.index;
    db.collection('wish').where({'_id': 'Eileen'}).update({
      data: {
        ['manWishList.' + [index]]: {
          description: value
        }
      }
    }).then(res => {
      console.log(res);
      let targetItem = 'manWishList[' + index + '].description'
      that.setData({
        [targetItem]: value
      })
    }).catch(err => {
      console.log(err);
    })
  },
  submitWomanDescription () {
    let that = this;
    let value = e.detail.value;
    let index = e.currentTarget.dataset.index;
    db.collection('wish').where({'_id': 'Eileen'}).update({
      data: {
        ['womanWishList.' + [index]]: {
          description: value
        }
      }
    }).then(res => {
      console.log(res);
      let targetItem = 'womanWishList[' + index + '].description'
      that.setData({
        [targetItem]: value
      })
    }).catch(err => {
      console.log(err);
    })
  },
  // 提交表单
  submitForm (newData) {
    let list;
    if (app.globalData.userInfo.user === 'man') {
      list = 'manWishList';
    } else if (app.globalData.userInfo.user === 'woman') {
      list = 'womanWishList';
    }

    db.collection('wish').where({'_id': 'Eileen'}).update({
      data: {
        [list]: _.unshift(newData)
      }
    }).then(res => {
      console.log(res);
      this.closeUploadBox('clean');
      this.getWishList();
    }).catch(err => {
      console.log(err);
    })
  },
  selectStar (e) {
    let that = this;
    let num = 0;
    let touchX = e.touches[0].pageX;
    let starLen = 16;
    let query = wx.createSelectorQuery();
    query.select('.star-select-section').boundingClientRect(function (rect) {
      that.setData({
        starOffset: rect.left
      })
    }).exec();
    query.select('.star-select-icon').boundingClientRect(function (rect) {
      that.setData({
        starWidth: rect.width
      })
    }).exec();
    let starMinX = this.data.starOffset;
    let starWidth = this.data.starWidth;
    let starMaxX = starMinX + starWidth * 5 + starLen * 4;

    if (touchX > starMinX && touchX < starMaxX) {
      num = Math.ceil((touchX - starMinX) / (starWidth + starLen));
      if (num != that.data.score) {
        that.setData({
          score: num,
        })
      }
    } else if (touchX < starMinX) {
      that.setData({
        score: 0,
      })
    }
  },
  selectImg () {
    const that = this;
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.setData({
          userImageList: res.tempFilePaths,
          selected: true
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  uploadToCloud () {
    const filePath = this.data.userImageList;
    const fileLength = filePath.length;
    const newData = {
      description: this.data.descriptionValue,
      finished: false,
      star: this.data.score || 0,
      imageList: [],
      time: commonJs.getToday().split(' ')[0]
    }
    if (fileLength > 0) {
      for (let i = 0; i < fileLength; i++) {
        const cloudPath = "wish/wishImg/" + new Date().getTime() +"-"+ Math.floor(Math.random() * 1000);
        newData.imageList.push('cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/' + cloudPath);
        //上传图片
        wx.cloud.uploadFile({
          cloudPath,
          filePath: filePath[i],
          success: res => {
            console.log('[上传文件] 成功：', res)
            wx.showLoading({
              title: '添加成功',
              mask: true
            })
            if (i === fileLength - 1) {
              this.submitForm(newData);
            }
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
      }
    } else {
      wx.showLoading({
        title: '添加成功',
        mask: true
      });
      this.submitForm(newData);
      wx.hideLoading();
    }
    
  },
  doUpload () {
    if (!app.globalData.userInfo || (app.globalData.userInfo.user !== 'woman' && app.globalData.userInfo.user !== 'man')) {
      wx.showModal({
        title: '提示',
        content: '您暂时没有权限添加哦~',
        showCancel: false,
        confirmColor: '#ffbe46'
      })
      return
    }
    if (this.data.descriptionValue === '') {
      wx.showModal({
        title: '确认添加？',
        content: '空的，添加个溜溜球愿望哦',
        confirmColor: '#ffbe46'
      })
    } else {
      this.uploadToCloud()
    }
  },
  //init
  setNumber (list, type) {
    let that = this;
    if (type === 'man') {
      this.setData({
        manFinishedNumber: 0,
        manUnfinishNumber: 0
      })
      list.map((item) => {
        if (item.finished) {
          that.setData({
            manFinishedNumber: that.data.manFinishedNumber + 1
          })
        } else {
          that.setData({
            manUnfinishNumber: that.data.manUnfinishNumber + 1
          })
        }
      });
    } else {
      this.setData({
        womanFinishedNumber: 0,
        womanUnfinishNumber: 0
      })
      list.map((item) => {
        if (item.finished) {
          that.setData({
            womanFinishedNumber: that.data.womanFinishedNumber + 1
          })
        } else {
          that.setData({
            womanUnfinishNumber: that.data.womanUnfinishNumber + 1
          })
        }
      });
    }
  },
  allowConfigBtn () {
    if (!app.globalData.userInfo || !app.globalData.userInfo.user) {
      this.setData({
        isManUser: true,
        isWomanUser: true
      })
    } else if (app.globalData.userInfo.user === 'woman') {
      this.setData({
        isManUser: true,
        isWomanUser: false
      })
    } else if (app.globalData.userInfo.user === 'man') {
      this.setData({
        isManUser: false,
        isWomanUser: true
      })
    }
  },
  getWishList () {
    const that = this;
    db.collection('wish').where({'_id': 'Eileen'}).get({
      success(res) {
        let manWishList = res.data[0].manWishList;
        let womanWishList = res.data[0].womanWishList;
        that.setData({
          manCloudList: manWishList,
          womanCloudList: womanWishList,
          manWishList: manWishList,
          womanWishList: womanWishList
        });
        that.setNumber(that.data.manWishList, 'man');
        that.setNumber(that.data.womanWishList, 'woman');
        that.setData({
          displayMan: true,
          displayWoman: true,
        });
      }
    })
  },
  onShow () {
    if (this.data.manCloudList.length < 1) {
      this.getWishList();
    }
  },
  onShareAppMessage() {
    return {
      title: '看看我们的小日子',
      path: '/pages/index/index',
      imageUrl: '../../images/shareApp.png'
    }
  },
  onLoad () {
    this.allowConfigBtn();
    this.getWishList();
  },
  onReady() {
    if (app.globalData.userInfo && (app.globalData.userInfo.user === 'man' || app.globalData.userInfo.user === 'woman')) {
      this.setData({
        showUploadBtn: true
      });
    }
  }
})
