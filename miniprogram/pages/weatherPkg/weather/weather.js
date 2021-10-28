import * as echarts from '../components/ec-canvas/echarts';
const app = getApp()
const commonJs = require('../../../components/utils/common')

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);

  const option = {
    title: {
      text: '未来24小时',
      left: 'center',
      textStyle: {
        fontSize: 20,
        lineHeight: 40,
        color: '#92bbe4'
      }
    },
    legend:{
      left: 'center',
      z: 2
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: '#fff7ee',
      textStyle: {
        color: '#ffbe46'
      },
      formatter: '{b} {c}°C'
    },
    xAxis: {
      type: 'category',
      data: app.globalData.weatherInfo.todayHourInfoList.hourTimeList
    },
    yAxis: {
      x: 'center',
      type: 'value',
      name: '°C'
    },
    visualMap: {
      type: 'continuous',
      min: 0,
      max: 40,
      realtime: false,
      calculable : true,
      color: ['#ff4800', '#ffd900', '#00ff80', '#00d6dd', '#0e0088'],
      top: 10,
      right: 10
    },
    series: [{
      smooth: true,
      type: 'line',
      data: app.globalData.weatherInfo.todayHourInfoList.hourTmpList,
      lineStyle: {
        width: 3,
        shadowColor: 'rgba(0,0,0,0.4)',
        shadowBlur: 10,
        shadowOffsetY: 10
      }
    }]
  };

  chart.clear();
  chart.setOption(option);

  return chart;
}

Page({
  data: {
    location: '',
    weatherTitle: '',
    weatherSrc: '',
    nowTmp: '',
    tmpMax: '',
    tmpMin: '',
    fontColor: '',
    detailList :[
      {
        'title': '风力:',
        'value': '',
      },
      {
        'title': '紫外线强度:',
        'value': '',
      },
      {
        'title': '日出时间:',
        'value': '',
      },
      {
        'title': '日落时间:',
        'value': '',
      },
      
    ],
    weatherWeek: [],
    captionList: [],
    ec: {
      onInit: initChart
    }
  },
  setTodayCaption (color) {
    switch (color) {
      case 'rainy':
        this.setData({
          captionList: [
            '带伞带伞带伞，重要的话，说三遍',
            '下雨啦',
            '哦哟，我没带伞，快带我回家',
            '回家收衣服哦',
            '一天天的就知道下雨',
            '又要湿哒哒的了'
          ]
        })
        break;
      case 'hot':
        this.setData({
          captionList: [
            '别说你了，我都快热化了，你呢',
            '这就高温了？！',
            '这也太热了吧',
            '刨冰~，冷饮~，冰淇凌~',
            '拖鞋~，背心~，西瓜冰~',
            '我7分熟了，你呢'
          ]
        })
        break;
      case 'cloudy':
        this.setData({
          captionList: [
            '给愉快的小日子来点微风',
            '啊~舒服~',
            '适合出去放风筝，也适合出去发疯',
            '没什么好看的了，不冷也不热',
          ]
        })
        break;
      case 'brezzy':
        this.setData({
          captionList: [
            '有点冷了哦，外套穿起来',
            '听我口令，风，起~',
            '给愉快的小日子来点凉风',
            '还可以，我扛得住这温度，你呢',
          ]
        })
        break;
      case 'snow':
          this.setData({
            captionList: [
              '干什么，这温度要干什么，不给人活命了是不是？？',
              '我打。。。字的。。手。。微微。。颤。抖。。。',
              '我怀疑我在冰箱里，你呢',
              '吹呀吹呀，我的骄傲放纵~',
              '吹不动了，我要冻僵了，我的羽绒服都要冻住了'
            ]
          })
          break;
    }
  },
  showTodayWeatherImage (tmp, cond_txt) {
    let weatherImg = ''
    let color = ''
    if (cond_txt.indexOf('雨') > 0) {
      weatherImg = 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/weather/rainy.png'
      color = 'rainy'
    } else if (tmp >= 35) {
      weatherImg = 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/weather/35.png'
      color = 'hot'
    } else if (tmp >= 30 && tmp < 35) {
      weatherImg = 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/weather/30.png'
      color = 'hot'
    } else if (tmp >= 25 && tmp < 30) {
      weatherImg = 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/weather/25.png'
      color = 'hot'
    } else if (tmp >= 15 && tmp < 25) {
      weatherImg = 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/weather/20.png'
      color = 'cloudy'
    } else if (tmp > 0 && tmp < 15) {
      weatherImg = 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/weather/5.png'
      color = 'brezzy'
    } else if (tmp <= 0) {
      weatherImg = 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/weather/0.png'
      color = 'snow'
    }
    this.setData({
      weatherSrc: weatherImg,
      fontColor: color
    })
    this.setTodayCaption(color);
  },
  showDetails (detailObj) {
    this.setData({
      'detailList[0].value': detailObj['wind_sc'] + '级',
      'detailList[1].value': detailObj['uv_index'] + '级',
      'detailList[2].value': detailObj['sr'],
      'detailList[3].value': detailObj['ss']
    })
  },
  showWeekInfo (weekArr) {
    let tmpArr = []
    const date = new Date()
    let indexDate = date.getDay()
    const weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
    weekArr.map((item, index) => {
      if (index > 0) {
        const dateArr = item.date.split('-')
        const avgTmp = (parseInt(item.tmp_max) + parseInt(item.tmp_min)) / 2
        item.date = dateArr[1] + '-' + dateArr[2]
        let targetIndex = indexDate + index
        if (targetIndex < 7) {
          item.weekday = weekday[targetIndex]
        } else {
          targetIndex = targetIndex - 7
          item.weekday = weekday[targetIndex]
        }
        if (item.cond_txt_n.indexOf('雨') > 0 || item.cond_txt_d.indexOf('雨') > 0) {
          item.img_code = 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/weather/rainy.png'
          item.color = 'rainy'
        } else if (avgTmp >= 35) {
          item.img_code = 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/weather/35.png'
          item.color = 'hot'
        } else if (avgTmp >= 30 && avgTmp < 35) {
          item.img_code = 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/weather/30.png'
          item.color = 'hot'
        } else if (avgTmp >= 25 && avgTmp < 30) {
          item.img_code = 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/weather/25.png'
          item.color = 'hot'
        } else if (avgTmp >= 15 && avgTmp < 25) {
          item.img_code = 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/weather/20.png'
          item.color = 'cloudy'
        } else if (avgTmp > 0 && avgTmp < 15) {
          item.img_code = 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/weather/5.png'
          item.color = 'brezzy'
        } else if (avgTmp <= 0) {
          item.img_code = 'cloud://smallthing-qcc.736d-smallthing-qcc-1304182350/weather/0.png'
          item.color = 'snow'
        }
        tmpArr.push(item)
      }
      if (weekArr.length === index + 1) {
        this.setData({
          weatherWeek: tmpArr
        })
      }
    });
  },
  addWeatherData (weatherInfo) {
    let hourTimeList = [];
    let hourTmpList = [];
    weatherInfo.hourly.map((item) => {
      hourTimeList.push(item.time.split(' ')[1])
      hourTmpList.push(parseInt(item.tmp))
    });
    weatherInfo.todayHourInfoList = {}
    weatherInfo.todayHourInfoList.hourTimeList = hourTimeList
    weatherInfo.todayHourInfoList.hourTmpList = hourTmpList
  },
  setWeatherData () {
    const weatherData = commonJs.cloneObj(app.globalData.weatherInfo)
    this.showTodayWeatherImage(weatherData.now.tmp, weatherData.now.cond_txt)
    this.showDetails(weatherData['daily_forecast'][0])
    this.setData({
      location: weatherData.basic['parent_city'] + ' ' + weatherData.basic.location + ' ' + weatherData['daily_forecast'][0].date,
      weatherTitle: weatherData.now['cond_txt'],
      nowTmp: weatherData.now.tmp,
      tmpMax: weatherData['daily_forecast'][0]['tmp_max'],
      tmpMin: weatherData['daily_forecast'][0]['tmp_min'],
    })
    this.showWeekInfo(weatherData['daily_forecast'])
  },
  subscribeWeather () {
    wx.requestSubscribeMessage({
      tmplIds: ['ExMGsXLh1p8R6HuBR1NOi7-RryIHYD8tViI5Ch8rPxw'],
      success (res) {
        console.log(res)
        if (res['ExMGsXLh1p8R6HuBR1NOi7-RryIHYD8tViI5Ch8rPxw'] === 'accept') {
          wx.cloud.callFunction({
            name: 'sendMsg',
            data: {
              openid: app.globalData.openId
            }
          }).then(res => {
            console.log(res)
          }).catch(err => {
            console.error(err);
          });;
          wx.showModal({
            title: '订阅成功',
            content: '每晚9点您的微信会有明日的天气预报提示',
            showCancel: false,
            confirmColor: '#ffbe46',
          })
        }
      },
      fail (err) {
        console.log(err)
      }
    })
  },
  onReady() {
    this.setWeatherData();
    const weatherData = commonJs.cloneObj(app.globalData.weatherInfo)
    console.log(weatherData)
  }
})
