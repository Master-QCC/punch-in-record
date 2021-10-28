Component({
  properties: {
    imagePath: String
  },
  data: {
    timer: ''
  },
  methods: {
    _sayHello (e) {
      const today = new Date();
      const nowHours = today.getHours();
      const that = this;
      this.data.timer = this.data.timer || {};

      if (nowHours >= 6 && nowHours <= 8) {
        this.setData({
          helloText: '早上好~，欢迎开启这美好的一天~'
        })
      } else if (nowHours > 10 && nowHours <= 12){
        this.setData({
          helloText: '要记得按时吃午饭哟~'
        })
      } else if (nowHours > 15 && nowHours <= 18) {
        this.setData({
          helloText: '晚饭吃完记得打卡哟~'
        })
      } else {
        const textList = [
          '本王已恭候您多时',
          '你不要老是点我，会秃头的',
          '点我干嘛？想挨打？',
          '点，点，点，说这么多话，我不累的大概',
          '诶呀被发现啦！',
          'Hello~小朋友~',
          'How are you? 怎么是你',
          'How old are you? 怎么老是你',
          '我的腿是不是很长~',
          '立正！向领导敬礼~',
          '我这个手挥了一天了你才发现我嘛',
          '我想下班了，站累了',
          '你今天又来找我玩啦~',
          '石头，剪刀，布~',
          '想我了就直说'
        ]
        const textIndex = Math.ceil(Math.random() * textList.length);
        this.setData({
          helloText: textList[textIndex]
        })
      }
      
      clearTimeout(this.data.timer);
      this.data.timer = setTimeout(function(){ 
        that.setData({
          helloText: ''
        })
       }, 2000);
    }
  },
  ready() {

  }
})