const app = getApp()
const db = wx.cloud.database()
const _ = db.command;
Component({
  properties: {
    videoTitle: String,
    videoScr: String,
    time: String,
    thumbsNumber: Number,
    playNumber: Number,
    danmuNumber: Number,
    danmuList: Array,
    itemNum: Number,
  },
  data: {
    videoTitle: '',
    videoScr: '',
    time: '',
    agree: false,
    currentTime: '',
    firstPlay: true,
    focus: false
  },
  methods: {
    _thumbsUp (e) {
      const itemindex = e.currentTarget.dataset.itemNum;
      db.collection('history').where({'_id': 'Eileen'}).update({
        data: {
          ['videoList.'+[itemindex]]: {
            thumbsNumber: _.inc(1)
          }
        }
      }).then(res => {
        console.log(res);
        this.setData({
          agree: true,
          thumbsNumber: this.data.thumbsNumber + 1
        })
      }).catch(err => {
        console.log(err);
      })
    },
    _startPlay (e) {
      if (app.globalData.previousVideo && app.globalData.previousVideo !== this.videoContext) {
        app.globalData.previousVideo.pause();
      }
      app.globalData.previousVideo = this.videoContext;
      
      if (this.data.firstPlay) {
        const itemindex = e.currentTarget.dataset.itemNum;
        db.collection('history').where({'_id': 'Eileen'}).update({
          data: {
            ['videoList.'+[itemindex]]: {
              playNumber: _.inc(1)
            }
          }
        }).then(res => {
          console.log(res);
          this.setData({
            playNumber: this.data.playNumber + 1,
            firstPlay: false
          })
        }).catch(err => {
          console.log(err);
        })
      }
    },
    // 弹幕
    _danmuFocus () {
      this.setData({
        focus: true
      })
    },
    _danmuBlur () {
      this.setData({
        focus: false
      })
    },
    getRandomColor () {
      const rgb = []
      for (let i = 0; i < 3; ++i) {
        let color = Math.floor(Math.random() * 256).toString(16)
        color = color.length === 1 ? '0' + color : color
        rgb.push(color)
      }
      return '#' + rgb.join('')
    },
    _getCurrentTime (e) {
      this.data.currentTime = Math.round(e.detail.currentTime);
    },
    _addDanmu (e) {
      if (!this.data.danmuValue || this.data.danmuValue === '') {
        wx.showModal({
          title: '添加失败',
          content: '空弹幕？空气弹幕？',
          confirmColor: '#ffbe46'
        })
      } else {
        const itemindex = e.currentTarget.dataset.itemNum;
        const color = this.getRandomColor();
        let danmu = {
          text: this.data.danmuValue,
          color: color,
          time: parseInt(this.data.currentTime)
        }
        
        db.collection('history').where({'_id': 'Eileen'}).update({
          data: {
            ['videoList.'+[itemindex]]: {
              danmuList: _.push(danmu)
            }
          }
        }).then(res => {
          console.log(res);
          this.videoContext.sendDanmu({
            text: this.data.danmuValue,
            color: color
          })
          this.setData({
            danmuValue: '',
            danmuNumber: this.data.danmuNumber + 1
          })
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1000
          })
        }).catch(err => {
          console.log(err);
        })
      }
    }
  },
  ready() {
    const videoId = 'video-' + this.data.itemNum;
    this.videoContext = wx.createVideoContext(videoId, this);
  }
})