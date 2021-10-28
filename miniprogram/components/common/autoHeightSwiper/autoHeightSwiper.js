Component({
  properties: {
    imageList: Array
  },
  data: {
    swiperHeight: '',
  },
  methods: {
    swiperChange (e) {
      const current = e.detail.current;
      const currentClass = '.image-' + current
      const query = wx.createSelectorQuery().in(this);
      query.select(currentClass).boundingClientRect();
      query.exec((res) => {
        this.setData({
          swiperHeight: res[0].height
        });
      })
    },
    setDefaultHeight () {
      if (this.data.swiperHeight === '') {
        const query = wx.createSelectorQuery().in(this);
        query.select('.image-0').boundingClientRect();
        query.exec((res) => {
          this.setData({
            swiperHeight: res[0].height
          });
        })
      }
    }
  },
  ready() {
    
  }
})