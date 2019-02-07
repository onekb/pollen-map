// pages/list/list.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   * 载入显示刚才点击的内容
   */
  onLoad: function (options) {
    this.setData({
      list: app.pollenData.gatherCirclesArray[options.id].data
    })
  },
})