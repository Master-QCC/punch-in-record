const cloud = require('wx-server-sdk');
const rp = require('request-promise');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  let url = 'https://free-api.heweather.net/s6/weather/?location=121.52609%2C31.25956&key=d672cc3c78044142ad843e6d783d6009';
  let resData, title, lifeStyle;
  let userList = [];

  await rp(url)
    .then( res => {
      resData = JSON.parse(res).HeWeather6[0];
      title = resData['daily_forecast'][1].cond_txt_d === resData['daily_forecast'][1].cond_txt_n ? 
        resData['daily_forecast'][1].cond_txt_d : (resData['daily_forecast'][1].cond_txt_d + '转' + resData['daily_forecast'][1].cond_txt_n);
    }).catch(function(err){
      console.log(err);
    });

  if (title.indexOf('雨') > 0) {
    lifeStyle = '记得带伞！有雨的！别自信！'
  } else {
    lifeStyle = '没雨的小日子，又可以皮一天~'
  }
  
  if (event.openid) {
    userList = [event.openid];
  } else {
    await cloud.database().collection("weather").get()
      .then( res => {
        userList = res.data[0].userList
      }).catch(function(err){
        console.log(err);
      });
  }

  for (let openid of userList) {
    const result = await cloud.openapi.subscribeMessage.send({
      "touser": openid,
      "page": 'pages/index/index',
      "data": {
        date1: {
          value: resData['daily_forecast'][1].date
        },
        phrase3: {
          value: title
        },
        character_string4: {
          value: resData['daily_forecast'][0]['tmp_min'] + '°C ~ ' + resData['daily_forecast'][0]['tmp_max'] + '°C',
        },
        thing5: {
          value: lifeStyle
        }
      },
      "templateId": 'ExMGsXLh1p8R6HuBR1NOi7-RryIHYD8tViI5Ch8rPxw'
    })
    return result
  }
 }