// pages/index/index.js
var app = getApp()
import { Pollen } from '../../utils/Pollen'

var map = null

//普通标记点
var markers = {
  latitude: 39.908823,
  longitude: 116.397470,
  iconPath: '/images/locateB.png',
  width: '40rpx',
  height: "50rpx"
}

//圈子标记点
var circlesMarkers = {
  id: 0,
  latitude: 39.908823,
  longitude: 116.397470,
  iconPath: '/images/locateB.png',
  width: '40rpx',
  height: "50rpx",
  callout: {
    content: '符合标记点{num}个',
    display: 'ALWAYS'
  }
}

//圈子
var circles = {
  latitude: 39.908823,
  longitude: 116.397470,
  radius: 500,
  fillColor: "#ff044433"
}

//模式步骤
var skip = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    circles: []
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    map = wx.createMapContext('mapId', this)
  },

  //bind 生成随机标记点
  rand: function () {
    //获取可视范围内坐标 在里面生成30个随机坐标点
    map.getRegion({
      success: res => {
        //随机散播
        var arr = []
        for (var i = 0; i < 30; i++) {
          var latitude = (res.southwest.latitude + (Math.random() * (res.northeast.latitude - res.southwest.latitude)))
          var longitude = (res.southwest.longitude + (Math.random() * (res.northeast.longitude - res.southwest.longitude)))
          markers.latitude = latitude
          markers.longitude = longitude
          arr.push(Object.assign({}, markers))
        }
        //初始化pollen(放入初始数据)
        var pollen = new Pollen(arr)
        //使用友好输出方式计算（放入配置好的圈/标记点）
        var pollenData = pollen.getGatherCirclesFriendly(circles, circlesMarkers)
        //将数据放到全局变量 让其他页面也能共享此数据
        app.pollenData = pollenData
      }
    })
  },

  //bind 控制圈子是否显示
  showCircles: function () {
    if (this.data.circles.length) {
      this.setData({
        circles: []
      })
    } else {
      this.setData({
        circles: app.pollenData.circles
      })
    }
  },

  //bind 控制标记点显示方式 0-node 1-普通标记点 2-圈子标记点 3-普通+圈子标记点
  showMarkers: function () {
    ++skip == 4 ? skip = 0 : 0
    switch (skip) {
      case 0:
        this.setData({
          markers: []
        })
        break
      case 1:
        this.setData({
          markers: app.pollenData.point
        })
        break
      case 2:
        this.setData({
          markers: app.pollenData.circlesMarkers
        })
        break
      case 3:
        this.setData({
          markers: app.pollenData.point.concat(app.pollenData.circlesMarkers)
        })
        break
    }
  },

  //bind 圈子标记点被点击后
  markertap: function (res) {
    wx.navigateTo({
      url: '/pages/list/list?id=' + res.markerId
    })
  }
})