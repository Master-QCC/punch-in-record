const commonJs = require('../../../components/utils/common')
const app = getApp()
const db = wx.cloud.database()

Component({
  properties: {

  },
  data: {
    todayName: '',
    todayWeather: '',
    title: '打卡',
    lunchTitle: '午餐',
    lunchDes: '11:00 - 13:00',
    dinnerTitle: '晚餐',
    dinnerDes: '16:00 - 19:00',
    addNumber: '+ 1',
    showOutlineStar: true,
    getLunchStar: false,
    getDinnerStar: false,
    shakeLunch: false,
    shakeDinner: false,
    disabled: true,
    lunchPunched: false,
    dinnerPunched: false,
    punched: false,
    lunchBG: 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/punch/lunch.png',
    dinnerBG: 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/punch/dinner.png'
  },

  methods: {
    updateDataPunchItem(isLunch) {
      const that = this
      setTimeout(function () {
        wx.vibrateLong()
        if (isLunch) {
          that.setData({
            getLunchStar: true,
            shakeLunch: true
          })
        } else {
          that.setData({
            getDinnerStar: true,
            shakeDinner: true,
          })
        }
        that.selectComponent("#punch-total-component").reduceStar(1, isLunch)
      }, 1000)

    },
    show_popUp () {
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

      const date = new Date();
      const nowHour = date.getHours();
      const isLunchTime = nowHour >= 11 && nowHour < 13
      const isDinnerTime = nowHour >= 16 && nowHour < 19
      const lunchPunched = this.data.lunchPunched
      const dinnerPunched = this.data.dinnerPunched
      if (this.data.showOutlineStar && isLunchTime && !lunchPunched) {
        // 中午打卡成功
        wx.showToast({
          title: '打卡成功',
          icon: 'success',
          duration: 1000
        })
        this.setData({
          showOutlineStar: false,
          lunchPunched: true,
        }, this.updateDataPunchItem(true))
      } else if (this.data.showOutlineStar && isDinnerTime && !dinnerPunched) {
        // 晚上打卡成功
        wx.showToast({
          title: '打卡成功',
          icon: 'success',
          duration: 1000
        })
        this.setData({
          showOutlineStar: false,
          dinnerPunched: true,
        }, this.updateDataPunchItem(false))
      } else if (!isLunchTime && !isDinnerTime) {
        wx.showModal({
          title: '打卡失败',
          content: '不在规定的时间哦',
          showCancel: false,
          confirmColor: '#ffbe46',
        })
      } else {
        wx.showModal({
          title: '打卡失败',
          content: '星星已经领取过啦，不能贪心哦~',
          showCancel: false,
          confirmColor: '#ffbe46'
        })
      }
    },
    refreshData () {
      const today = new Date()
      const nowHour = today.getHours();
      const isLunchTime = nowHour >= 11 && nowHour < 13
      const isDinnerTime = nowHour >= 16 && nowHour < 19

      if (isLunchTime || isDinnerTime) {
        this.setData({
          disabled: false
        })
      } else {
        this.setData({
          disabled: true
        })
      }
    },
    refreshUserDetial () {
      this.selectComponent('#punch-total-component').setUserDetial();
    },
    calcDays () {
      const todayValue = commonJs.getToday()
      this.setData({
        todayName: todayValue
      })
      this.refreshData()
    },
    showWeather (weatherInfo) {
      this.setData({
        todayWeather: weatherInfo.now.tmp + '℃ ' + weatherInfo.now.cond_txt + ' >'
      })
    },
    getPunchStatus () {
      const date = commonJs.getToday().split(' ')[0]
      const that = this
      db.collection('star').where({'_id': date}).get({
        success(res) {
          that.setData({
            getLunchStar: res.data[0].lunchStar,
            getDinnerStar: res.data[0].dinnerStar
          })
          if (that.data.getLunchStar) {
            that.setData({
              lunchPunched: true,
              lunchBG: 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/gif/pinched.webp',
              punched: true,
            })
          }
          if (that.data.getDinnerStar) {
            that.setData({
              dinnerPunched: true,
              dinnerBG: 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/gif/pinched.webp',
              punched: true,
            })
          }
        }
      })
    }
  },
  ready() {
    if (!app.globalData.weatherInfo || app.globalData.weatherInfo.length < 1) {
      commonJs.getTodayWeather().then(res => {
        app.globalData.weatherInfo =  res.data.HeWeather6[0]
        this.showWeather(app.globalData.weatherInfo);
      });
    } else{
      this.showWeather(app.globalData.weatherInfo);
    }
    this.calcDays();
    this.getPunchStatus();
  }
})