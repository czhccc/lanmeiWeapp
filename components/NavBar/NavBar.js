// components/common/NavBar/NavBar.js
Component({
  options: {
    styleIsolation: 'shared',
  },
  properties: {
    title: String,
    noBackArrow: {
      type: Boolean,
      value: false
    },
    placeholder: {
      type: Boolean,
      value: true
    },
    customBack: {
      type: Boolean,
      value: false
    }
  },
  data: {

  },
  methods: {
    toBack() {
      if (this.properties.customBack) {
        this.triggerEvent('customBack')
      } else {
        wx.navigateBack({
          delta: 1
        }); 
      }
    }
  }
})
