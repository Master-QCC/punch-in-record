Component({
  properties: {
    imageList: Array,
    currentIndex: Number,
    openGallery: Boolean
  },
  data: {
    imageList: [],
    currentIndex: 0,
    openGallery: false
  },
  methods: {
    _closeGallery () {
      this.setData({ 
        openGallery: false
      })
      setTimeout(() => { 
        this.setData({
          imageList: []
        })
      }, 200);
    }
  },
  ready() {
    
  }
})