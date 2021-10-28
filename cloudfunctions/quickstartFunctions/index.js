const getOpenId = require('../getOpenId/index')
const getPhone = require('../getPhone/index')
const sendMsg = require('../sendMsg/index')

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getOpenId':
      return await getOpenId.main(event, context)
    case 'getPhone':
      return await getPhone.main(event, context)
    case 'sendMsg':
      return await sendMsg.main(event, context)
  }
}
