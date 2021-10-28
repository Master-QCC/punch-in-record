//common.js
const app = getApp()

function getTodayFormat (seperator) {
  const today = new Date();
  seperator = seperator || '/';
  return (today.getMonth() + 1) + seperator + today.getDate() + seperator + today.getFullYear();
}

function getToday () {
  const today = new Date()
  const indexDate = today.getDay()
  const seperator = "-";
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let strDate = today.getDate();
  if (month >= 1 && month <= 9) {
      month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
  }
  const currentdate = year + seperator + month + seperator + strDate;
  const weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
  const todayValue = currentdate + ' ' + weekday[indexDate]
  return todayValue;
}

function getFutureDay (date) {
   //day format: 01/01
   date = date + '/'
  let futureDate;
  const now = new Date();
  const nowYear = now.getFullYear();
  const anniverDate = new Date(date + nowYear);
  const nowDate = new Date(getTodayFormat())
  if (nowDate.getTime() <= anniverDate.getTime()) {
    futureDate = date + nowYear
  } else {
    futureDate = date + (nowYear + 1)
  }
  return futureDate;
}

function cloneObj (obj) { 
  const newObj = JSON.parse(JSON.stringify(obj))
  return newObj;  
}

function allowShare () {
  wx.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
}

function countTotalDays (day) {
  //day format: 01/01/2020
  const currentDate = getTodayFormat()
  const time1 = Date.parse(day)
  const time2 = Date.parse(currentDate)
  const dayCount = (Math.abs(time2 - time1))/1000/60/60/24
  return dayCount;
}

function getTodayWeather () {
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  let promise = new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        const weatherUrl = 'https://free-api.heweather.net/s6/weather/?location=' + res.longitude + '%2C' + res.latitude +'&key=d672cc3c78044142ad843e6d783d6009'
        wx.request({
          url: weatherUrl,
          success: function (res) {
            if (res.data.HeWeather6) {
              let weatherInfo = res.data.HeWeather6[0];
              let hourTimeList = [];
              let hourTmpList = [];
              weatherInfo.hourly.map((item) => {
                hourTimeList.push(item.time.split(' ')[1])
                hourTmpList.push(parseInt(item.tmp))
              });
              weatherInfo.todayHourInfoList = {}
              weatherInfo.todayHourInfoList.hourTimeList = hourTimeList
              weatherInfo.todayHourInfoList.hourTmpList = hourTmpList
              resolve(res);
            }
          },
          fail: function (err) {
            console.error(err)
            reject(err);
          },
          complete: function () {
            wx.hideLoading()
          }
        })
      },
      fail (err) {
        wx.hideLoading()
        console.error(err);
      }
    })
  })
  return promise;
}

function getUserDetial () {
  // 查看是否授权
  let promise = new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: '用于显示用户昵称及头像',
      success: function(res) {
        app.globalData.userInfo = res.userInfo;
        console.log('common,getUserProfile',res);
        resolve()
      }
    })
  })
  return promise;
}

function login () {
  wx.showLoading({
    title: '登录中...',
    mask: true
  })
  wx.login({
    success: function (res) {
      wx.cloud.callFunction({
        name: 'getOpenId',
        }).then(res => {
        wx.hideLoading();
        app.globalData.openId = res.result.openid
        let length = app.globalData.userWhiteList.length
        for (let i = 0; i < length; i++) {
          if (app.globalData.userWhiteList[i].openId === app.globalData.openId) {
            app.globalData.isLogin = true
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
        }
        wx.getUserProfile({
          desc: '用于显示用户昵称及头像',
          success: function (res) {
            app.globalData.userInfo = res.userInfo
          }
        })
        return app.globalData.isLogin;
      }).catch(err => {
        wx.hideLoading();
        console.error(err);
        return app.globalData.isLogin;
      });
    }
  })
}

module.exports = {
  getToday: getToday,
  getTodayFormat: getTodayFormat,
  cloneObj: cloneObj,
  allowShare: allowShare,
  countTotalDays: countTotalDays,
  getTodayWeather: getTodayWeather,
  getUserDetial: getUserDetial,
  login: login,
  getFutureDay: getFutureDay
}
