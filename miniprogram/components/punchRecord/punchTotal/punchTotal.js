const app = getApp()
const commonJs = require('../../../components/utils/common')
const db = wx.cloud.database()
Component({
  properties: {
    'totalList[2].detailsText': String
  },

  data: {
    loveName: 'Hi，小东西',
    showLove: false,
    isLogin: false,
    smallName: '点击上方登录按钮，即可登录',
    totalList: [
      {
        'detailsIcon': 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/icon/together.svg',
        'detailsText': '-',
        'detailsUnit': '天',
        'detailsPopUp': '在一起',
        'showDetail': false,
        'showNumber': false,
        'numberPopUp': ''
      },
      {
        'detailsIcon': 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/icon/star-list.svg',
        'detailsText': '-',
        'detailsUnit': '颗',
        'detailsPopUp': '累计',
        'showDetail': false,
        'showNumber': false,
        'numberPopUp': '+1'
      },
      {
        'detailsIcon': 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/icon/list.svg',
        'detailsText': '-',
        'detailsUnit': '个',
        'detailsPopUp': '今日未得',
        'showDetail': false,
        'showNumber': false,
        'numberPopUp': '-1'
      },
    ]
  },

  methods: {
    show_detail_popUp (e) {
      const target = e.currentTarget
      const itemindex = target.dataset.itemNum
      const targetItem = 'totalList[' + itemindex + '].showDetail'
      for (let i = 0; i < this.data.totalList.length; i++){
        if (i !== itemindex) {
          const hideItem = 'totalList[' + i + '].showDetail'
          this.setData({
            [hideItem]: false
          })
        }
      }
      if (!this.data.totalList[itemindex].showDetail) {
        this.setData({
          [targetItem]: true
        })
      } else {
        this.setData({
          [targetItem]: false
        })
      }
    },
    show_love_name () {
      if (this.data.showLove) {
        this.setData({
          showLove: false
        })
      } else {
        this.setData({
          showLove: true
        })
      }
    },
    updateDBTodayData (isLunch, reduceStar) {
      const date = commonJs.getToday().split(' ')[0]
      const todayStarData = this.data.totalList[2].detailsText - reduceStar
      let updateTodayData = {
        todayStar: todayStarData
      }

      if (isLunch) {
        updateTodayData.lunchStar = true
      } else{
        updateTodayData.dinnerStar = true
      }
      
      db.collection('star').where({'_id': date}).update({
        data: updateTodayData
      }).then(res => {
        console.log(res);
        const residueStar = todayStarData
        this.setData({
          ['totalList[2].showNumber']: true,
          ['totalList[2].detailsText']: residueStar
        })
      }).catch(err => {
        console.log(err);
      })
    },
    updateDBTotalData (addStar) {
      const totalStar = this.data.totalList[1].detailsText + addStar
      let updateTotalData = {
        totalNumber: totalStar
      }
      
      db.collection('star').where({'_id': 'totalStar'}).update({
        data: updateTotalData
      }).then(res => {
        console.log(res);
        this.setData({
          ['totalList[1].showNumber']: true,
          ['totalList[1].detailsText']: totalStar
        })
      }).catch(err => {
        console.log(err);
      })
    },
    reduceStar (reduceStar, isLunch) {
      this.updateDBTodayData(isLunch, reduceStar)
      this.updateDBTotalData(reduceStar)
    },
    getTotalStarFromDB () {
      const that = this
      db.collection('star').where({'_id': 'totalStar'}).get({
        success(res) {
          that.setData({
            'totalList[1].detailsText': res.data[0].totalNumber
          })
        },fail(res) {
          console.error("数据库API获取totalStar数据失败！", res);
          return false;
        }
      })
    },
    getTodayStarFromDB () {
      const date = commonJs.getToday().split(' ')[0]
      const that = this
      db.collection('star').where({'_id': date}).get({
        success(res) {
          that.setData({
            'totalList[2].detailsText': res.data[0].todayStar
          })
        },fail(res) {
          console.error("数据库API获取todayStar数据失败！", res);
          return false;
        }
      })
    },
    initNumber () {
      const totalDay = commonJs.countTotalDays('5/20/2020');
      this.setData({
        'totalList[0].detailsText': totalDay
      })
      this.getTotalStarFromDB();
      this.getTodayStarFromDB();
    },
    setUserDetial () {
      if (app.globalData.userInfo && app.globalData.userInfo.user === 'woman') {
        this.setData({
          smallName: '杨浦诅咒怪 中国歪理王',
        })
      } else if (app.globalData.userInfo && app.globalData.userInfo.user === 'man') {
        this.setData({
          smallName: '您好，少爷',
        })
      } else {
        this.setData({
          smallName: '欢迎来到QCC的小日子',
        })
      }
    },
    goToLogin () {
      if (!app.globalData.isLogin) {
        wx.redirectTo({
          url: '../login/login'
        })
      }
    },
    login () {
      let that = this;
      wx.login({
        success: function (res) {
          wx.cloud.callFunction({
            name: 'getOpenId',
            }).then(res => {
            app.globalData.openId = res.result.openid
            let length = app.globalData.userWhiteList.length
            for (let i = 0; i < length; i++) {
              if (app.globalData.userWhiteList[i].openId === app.globalData.openId) {
                app.globalData.isLogin = true
                app.globalData.userInfo = {
                  user: app.globalData.userWhiteList[i].user
                }
                break;
              }
            }
    
            if (!app.globalData.isLogin) {
              wx.showModal({
                title: '提示',
                content: '暂无权限使用，只能看看哦~',
                showCancel: false,
                confirmColor: '#ffbe46'
              })
              return
            } else {
              that.setUserDetial();
              that.initNumber();
              that.setData({
                isLogin: true
              });
            }
            wx.getUserProfile({
              desc: '用于显示用户昵称及头像',
              success: function (res) {
                app.globalData.userInfo = res.userInfo
              }
            })
          }).catch(err => {
            console.error(err);
          });
        }
      })
    }
  },
  ready() {
    this.login();
  }
})