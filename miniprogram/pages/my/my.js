const app = getApp()
const db = wx.cloud.database()
const _ = db.command;
let previousIndex;
Page({
  data: {
    myAttrList: [
      {
        id: 'kindly',
        name: '假乖巧',
        description: '装的一手好乖巧，打完就跑，讲不过就装乖巧，3分钟之后就继续皮，没记性',
        image: 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/my/my1.png',
        open: false,
        detailImageList: []
      },{
        id: 'beautiful',
        name: '真美貌',
        description: '很会穿衣，很会搭配，主要是人好看，关键是穿我的衣服比我穿的好看，没天理啊',
        image: 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/my/my2.png',
        open: false,
        detailImageList: []
      },{
        id: 'clever',
        name: '看起来聪明',
        description: '算数小天才，5以内随便来，10以内的都不在乎，回自己家都不知道哪条路近',
        image: 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/my/my3.png',
        open: false,
        detailImageList: []
      },{
        id: 'cook',
        name: '中华小当家',
        description: '厨艺小能手，花式搭配，好吃就行，欲罢不能',
        image: 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/my/my4.png',
        open: false,
        detailImageList: []
      },{
        id: 'paint',
        name: '小梵（樊）高',
        description: '一些有趣的好看的，小作品，未来画家成名前的作品集，值得一生珍藏',
        image: 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/my/my5.png',
        open: false,
        detailImageList: []
      }
    ],
    showUploadBtn: false,
    addBtnId: -1
  },
  hideOpenItem (previousIndex) {
    if (previousIndex > -1) {
      const hideItemOpen = 'myAttrList[' + previousIndex + '].open'
      this.setData({
        [hideItemOpen]: false
      })
    }
    this.setData({
      showGallery: false
    })
  },
  expandImageList (e) {
    const itemindex = e.currentTarget.dataset.itemNum
    const targetItemOpen = 'myAttrList[' + itemindex + '].open'
    this.setData({
      addBtnId: -1
    })
    if (previousIndex !== undefined && previousIndex !== itemindex) {
      this.hideOpenItem(previousIndex);
    }
    if (!this.data.myAttrList[itemindex].open) {
      this.setData({
        [targetItemOpen]: true
      })
    } else {
      this.setData({
        [targetItemOpen]: false,
      })
    }
    previousIndex = itemindex
  },
  openGallery (e) {
    const currentIndex = e.currentTarget.dataset.index;
    const itemNum = e.currentTarget.dataset.itemNum;
    this.setData({
      imageList: this.data.myAttrList[itemNum].detailImageList,
      currentIndex: currentIndex,
      showGallery: true
    })
  },
  addImageIntoList (itemId, tempFilePath) {
    const newImageItem = {
      src: tempFilePath,
      mode: ''
    }
    this.data.myAttrList[itemId].detailImageList.push(newImageItem);
    const targetItem = 'myAttrList[' + itemId + '].detailImageList'
    this.setData({
      [targetItem]: this.data.myAttrList[itemId].detailImageList
    });
  },
  submitForm (itemId, tempFilePath, cloudPath) {
    const keyName = this.data.myAttrList[itemId].id;
    const newImageItem = {
      src: 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/' + cloudPath,
      mode: ''
    }
    db.collection('myAttr').where({'_id': 'Eileen'}).update({
      data: {
        ['myAttrList.'+[keyName]]: _.push(newImageItem)
      }
    }).then(res => {
      this.addImageIntoList(itemId, tempFilePath);
      wx.hideLoading();
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 1000
      })
    }).catch(err => {
      console.log(err);
    })
  },
  // 上传图片
  uploadTocloud (tempFilePath) {
    const cloudPath = "my/my" + (this.data.addBtnId + 1) + "/" + new Date().getTime() +"-"+ Math.floor(Math.random() * 1000);
    //上传图片
    wx.cloud.uploadFile({
      cloudPath,
      filePath: tempFilePath,
      success: res => {
        console.log('[上传文件] 成功：', res)
        this.submitForm(this.data.addBtnId, tempFilePath, cloudPath);
        this.closeUploadbtn();
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
  },
  openUploadBox (e) {
    const itemId = e.currentTarget.dataset.itemId;
    if (this.data.addBtnId !== itemId) {
      this.setData({
        addBtnId: itemId
      })
    } else {
      // check login
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
      
      const that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          wx.showLoading({
            title: '正在添加',
          })
          that.uploadTocloud(res.tempFilePaths[0]);
        },
        fail: e => {
          console.error(e)
        }
      })
    }
  },
  closeUploadbtn () {
    this.setData({
      addBtnId: -1
    })
  },
  getAttrImageList () {
    const that = this;
    db.collection('myAttr').where({'_id': 'Eileen'}).get({
      success(res) {
        that.setAttrImageList(res.data[0].myAttrList);
      }
    })
  },
  setAttrImageList (myAttrList) {
    this.setData({
      ['myAttrList[0].detailImageList']: myAttrList.kindly,
      ['myAttrList[1].detailImageList']: myAttrList.beautiful,
      ['myAttrList[2].detailImageList']: myAttrList.clever,
      ['myAttrList[3].detailImageList']: myAttrList.cook,
      ['myAttrList[4].detailImageList']: myAttrList.paint
    })
    wx.hideLoading();
  },
  onHide: function() {
    // 选择图片也会出发onHide
    // this.hideOpenItem(previousIndex);
  },
  onShareAppMessage() {
    return {
      title: '看看我们的小日子',
      path: '/pages/index/index',
      imageUrl: '../../images/shareApp.png'
    }
  },
  onLoad: function() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    this.getAttrImageList()
  },
  onReady() {
    if (app.globalData.userInfo && (app.globalData.userInfo.user === 'man' || app.globalData.userInfo.user === 'woman')) {
      this.setData({
        showUploadBtn: true
      });
    }
  }
})
