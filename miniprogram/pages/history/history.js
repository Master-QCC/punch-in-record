const app = getApp()
const commonJs = require('../../components/utils/common')
const db = wx.cloud.database()
const _ = db.command;
Page({
  data: {
    sortList: [],
    showList: [],
    showUploadBtn: false,
    showEnd: false,
    openUpload: false,
    closeUpload: false,
    disableUpload: false,
    showHistory: false,
    uploadTitleLabel: '添加回忆',
    detialTitleLabel: '标题：',
    detialDescriptionLabel: '详情：',
    detialDateLabel: '日期：',
    submitLabel: '添加',
    selected: false,
    uploadDes: '点击添加图片，长按即可删除',
    userImageList: [],
    stickyNav: false,
    daysList: [
      {
        daysMsg: '和bb在一起',
        daysNum: '-',
        color: '#FFBE46',
        imgScr: 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/historyBanner/together.jpg'
      },{
        daysMsg: '姥姥出生',
        daysNum: '-',
        color: '#9b6507',
        imgScr: 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/historyBanner/grandma.jpg'
      },{
        daysMsg: '小东西生日',
        daysNum: '-',
        color: '#684E41',
        imgScr: 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/historyBanner/birthday.png'
      },{
        daysMsg: '相识已经',
        daysNum: '-',
        color: '#7A6462',
        imgScr: 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/historyBanner/familiar.png'
      },{
        daysMsg: '',
        daysNum: '-',
        color: '#8b2d84',
        imgScr: 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/historyBanner/anniversaries.jpg'
      }
    ],
    sortNameList: [
      {
        text: '时间 (近→远)'
      }
    ],
    historyList: [],
    showGallery: false,
    currentIndex: '',
    imageList: [],
    needDelete: false
  },
  //滚动 sticky header
  onPageScroll (e) { 
    const windowHeight = wx.getSystemInfoSync().windowHeight;
    if (e.scrollTop > (windowHeight / 2)) {
      this.setData({
        stickyNav: true
      })
    } else {
      this.setData({
        stickyNav: false
      })
    }
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
        selected: this.data.userImageList.length > 0 ? true : false,
      })
      if (name == 'clean') {
        this.setData({
          titleValue: '',
          descriptionValue: '',
          dateValue: '',
          userImageList: []
        })
      }
    }
  },
  //删除图片
  deleteImg (e) {
    const that = this;
    wx.showModal({
      title: '删除这张图片 ？',
      confirmColor: '#ffbe46',
      success (res) {
        if (res.confirm) {
          const index = e.currentTarget.dataset.index;
          that.data.userImageList.splice(index, 1);
          that.setData({
            userImageList: that.data.userImageList,
            selected: that.data.userImageList.length > 0 ? true : false
          })
          
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
    
  },
  // 提交表单
  submitForm (newData) {
    const that = this;
    db.collection('history').where({'_id': 'Eileen'}).update({
      data: {
        historyList: _.unshift(newData)
      }
    }).then(res => {
      console.log(res);
      wx.hideLoading();
      that.setData({
        selected: false,
        disableUpload: false
      })
      this.getHistoryList();
    }).catch(err => {
      wx.hideLoading();
      that.setData({
        disableUpload: false
      })
      console.log(err);
    })
  },
  selectImg () {
    const that = this;
    wx.chooseImage({
      count: 5,
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

    wx.showLoading({
      title: '添加中',
    })

    this.setData({
      disableUpload: true
    });
    const filePath = this.data.userImageList;
    const fileLength = filePath.length;
    let dateValueArry = this.data.dateValue.split('-');
    const newData = {
      title: this.data.titleValue,
      description: this.data.descriptionValue,
      imageList: [],
      captionList: [],
      time: {
        fullTime: dateValueArry[1] + '/' + dateValueArry[2] + '/' + dateValueArry[0],
        agoTime: ''
      },
      agree: false,
      agreeNumber : 0,
      expand: false,
      itemNumber: null
    }
    for (let i = 0; i < fileLength; i++) {
      const cloudPath = "historyImg/" + new Date().getTime() +"-"+ Math.floor(Math.random() * 1000);
      newData.imageList.push({src: 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/' + cloudPath})

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
            this.closeUploadBox('clean');
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
        }
      })
    }
  },
  doUpload () {
    // check select image
    if (this.data.userImageList.length < 1) {
      wx.showModal({
        title: '还未选择图片',
        content: '图片没选，添加个溜溜球哦',
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
  // 记录交互
  openGallery (e) {
    if (this.data.needDelete) {
      return
    }
    const imageList = e.currentTarget.dataset.imageList;
    this.setData({
      imageList: imageList,
      currentIndex: 0,
      showGallery: true
    })
  },
  showTime (e) {
    if (this.data.needDelete) {
      return
    }
    const sortIndex = e.currentTarget.dataset.sortIndex;
    const tempTime = e.currentTarget.dataset.fullTime;
    const targetItem = 'historyList[' + sortIndex + '].time.agoTime';
    this.setData({
      [targetItem]: tempTime
    })
  },
  thumbsUp (e) {
    if (this.data.needDelete) {
      return
    }
    const itemindex = e.currentTarget.dataset.itemNum;
    const sortIndex = e.currentTarget.dataset.sortIndex;
    const targetAgreeItem = 'historyList[' + sortIndex + '].agree';
    const targetNumberItem = 'historyList[' + sortIndex + '].agreeNumber';
    if (!this.data.historyList[sortIndex].agree) {
      db.collection('history').where({'_id': 'Eileen'}).update({
        data: {
          ['historyList.'+[itemindex]]: {
            agreeNumber: _.inc(1)
          }
        }
      }).then(res => {
        console.log(res);
        this.setData({
          [targetAgreeItem]: true,
          [targetNumberItem]: this.data.historyList[sortIndex].agreeNumber + 1
        })
      }).catch(err => {
        console.log(err);
      })
    }
  },
  openComment (e) {
    const sortIndex = e.currentTarget.dataset.sortIndex;
    const captionList = this.data.historyList[sortIndex].captionList;
    const targetItem = 'historyList[' + sortIndex + '].openCaption';
    this.setData({
      [targetItem]: true
    });
  },
  closeComment (e) {
    const sortIndex = e.currentTarget.dataset.sortIndex;
    const targetItem = 'historyList[' + sortIndex + '].openCaption';
    this.setData({
      [targetItem]: false
    });
  },
  addComment (e) {
    const sortIndex = e.currentTarget.dataset.sortIndex;
    const targetItem = 'historyList[' + sortIndex + '].addCaption';
    const value = this.data.historyList[sortIndex].addCaption;
    this.setData({
      [targetItem]: !value
    });
  },
  inputComment (e) {
    const sortIndex = e.currentTarget.dataset.sortIndex;
    const targetItem = 'historyList[' + sortIndex + '].captionContent';
    this.setData({
      [targetItem]: e.detail.value
    });
  },
  submitComment (e) {
    const sortIndex = e.currentTarget.dataset.sortIndex;
    const itemindex = e.currentTarget.dataset.itemNum;
    const value = this.data.historyList[sortIndex].captionContent;

    if (value !== '') {
      db.collection('history').where({'_id': 'Eileen'}).update({
        data: {
          ['historyList.'+[itemindex]]: {
            captionList: _.push(value)
          }
        }
      }).then(res => {
        console.log(res);
        this.getHistoryList();
      }).catch(err => {
        console.log(err);
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '不好意思，暂不支持评论空气',
        cancelText: '对不起',
        confirmText: '我重写',
        confirmColor: '#ffbe46'
      })
    }
  },
  openMore (e) {
    if (this.data.needDelete) {
      return
    }
    const sortIndex = e.currentTarget.dataset.sortIndex;
    const targetItem = 'historyList[' + sortIndex + '].expand';
    const captionItem = 'historyList[' + sortIndex + '].openCaption';
    const addCaptionBox = 'historyList[' + sortIndex + '].addCaption';
    const targetItemValue = this.data.historyList[sortIndex].expand;

    if (targetItemValue) {
      this.setData({
        [targetItem]: false,
        [captionItem]: false,
        [addCaptionBox]: false
      })
    } else {
      this.setData({
        [targetItem]: true
      })
    }
  },
  // 记录删除
  showDeleteBtn () {
    if (this.data.showUploadBtn) {
      this.setData({
        needDelete: true
      })
    }
  },
  deleteImage (fileId) {
    wx.cloud.deleteFile({
      fileList: [fileId],
      success: res => {
        wx.showLoading({
          title: '删除成功',
          mask: true
        });
      },
      fail: console.error,
      complete () {
        wx.hideLoading();
      }
    })
  },
  deleteItem (e) {
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

    const that = this
    wx.showModal({
      title: '删除此条记录？',
      content: '删除了，就真的么得了哦',
      confirmColor: '#ffbe46',
      success (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除',
            mask: true
          });
          const sortIndex = e.currentTarget.dataset.sortIndex;
          db.collection('history').where({'_id': 'Eileen'}).update({
            data: {
              historyList: _.pull({
                title: _.eq(that.data.sortList[sortIndex].title),
                description: _.eq(that.data.sortList[sortIndex].description),
              })
            }
          }).then(res => {
            console.log(res);
            that.deleteImage(that.data.sortList[sortIndex].imageList[0].src);
            that.data.sortList.splice(sortIndex, 1);
            that.getHistoryList();
          }).catch(err => {
            console.log(err);
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
      complete () {
        wx.hideLoading();
      }
    })
  },
  finishDelete () {
    this.setData({
      needDelete: false
    })
  },
  onReachBottom () {
    const sortLength = this.data.sortList.length;
    const showLength = this.data.showList.length;
    if (showLength != sortLength) {
      if (sortLength - showLength >= 10) {
        this.data.showList = this.data.showList.concat(this.data.sortList.slice(showLength + 1, showLength + 11));
      } else {
        this.data.showList = this.data.sortList;
      }

      this.setData({
        historyList: this.data.showList,
        showHistory: true
      })
    } else {
      this.setData({
        showEnd: true
      })
    }
  },
  onHide () {
    //选择相册也会触发onHide
    // this.closeUploadBox();
    this.finishDelete();
  },
  onLoad() {
    const rate = 750 / wx.getSystemInfoSync().screenWidth
    const totalday = commonJs.countTotalDays('5/20/2020');
    const year = parseInt(totalday / 365) + 1;
    this.setData({
      "daysList[4].daysMsg": year + '周年纪念日',
      rate: rate
    });
  },
  setBannerValue () {
    const birthdayValue = commonJs.getFutureDay('3/27');
    const anniverValue = commonJs.getFutureDay('5/20');
    this.setData({
      "daysList[0].daysNum": commonJs.countTotalDays('5/20/2020'),
      "daysList[1].daysNum": commonJs.countTotalDays('03/27/2020') + 737427,
      "daysList[2].daysNum": commonJs.countTotalDays(birthdayValue),
      "daysList[3].daysNum": commonJs.countTotalDays('3/17/2020'),
      "daysList[4].daysNum": commonJs.countTotalDays(anniverValue)
    });
  },
  getHistoryList () {
    wx.showLoading({
      title: '加载中',
    })
    const that = this;
    db.collection('history').where({'_id': 'Eileen'}).get({
      success(res) {
        that.setData({
          showHistory: false
        })
        app.globalData.history = {}
        app.globalData.history.imageList = res.data[0].historyList
        app.globalData.history.videoList = res.data[0].videoList
        that.setHistoryList(res.data[0].historyList);
      }
    })
  },
  compare (prop) {
    return function (obj1, obj2) {
        var val1 = new Date(obj1.time[prop]);
        var val2 = new Date(obj2.time[prop]);
        if (val1 < val2) {
            return 1;
        } else if (val1 > val2) {
            return -1;
        } else {
            return 0;
        }            
    } 
  },
  setHistoryList (historyList) {
    const historyArryLength = historyList.length
    for(let i = 0; i < historyArryLength; i++) {
      const totalDays = commonJs.countTotalDays(historyList[i].time.fullTime);
      historyList[i].itemNumber = i;
      historyList[i].openCaption = false;
      historyList[i].addCaption = false;
      historyList[i].captionContent = '';
      if (totalDays === 0) {
        historyList[i].time.agoTime = '今天';
      } else if (totalDays > 0 && totalDays <= 7) {
        historyList[i].time.agoTime = totalDays + '天前';
      } else if (totalDays > 7 && totalDays <= 30) {
        historyList[i].time.agoTime = '1周前';
      } else if (totalDays > 30 && totalDays <= 60) {
        historyList[i].time.agoTime = '1个月前';
      } else if (totalDays > 60 && totalDays <= 180) {
        historyList[i].time.agoTime = '3个月前';
      } else if (totalDays > 180 && totalDays <= 365) {
        historyList[i].time.agoTime = '半年前';
      } else if (totalDays > 365) {
        historyList[i].time.agoTime = parseInt(totalDays/365) + '年前';
      }
    }
    this.data.sortList = commonJs.cloneObj(historyList);
    this.data.sortList.sort(this.compare('fullTime'));
    if (this.data.sortList.length > 10) {
      this.data.showList = this.data.sortList.slice(0, 10);
    }
    this.setData({
      historyList: this.data.showList,
      showHistory: true
    })
    wx.hideLoading();
  },
  onShareAppMessage() {
    return {
      title: '看看我们的小日子',
      path: '/pages/index/index',
      imageUrl: '../../images/shareApp.png'
    }
  },
  onReady () {
    if (app.globalData.userInfo && (app.globalData.userInfo.user === 'man' || app.globalData.userInfo.user === 'woman')) {
      this.setData({
        showUploadBtn: true
      });
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    this.setBannerValue();
    this.getHistoryList();
  }
})
