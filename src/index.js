//计算坐标
import { copyArrayObject } from "./utils/utils"
import { GatherCircles } from "./utils/src/GatherCircles"

class Pollen {
  //初始化
  constructor(point = [], config = {
    mode: 'median',//median中位数 ladder阶梯
    radiusMax: 1000,//圆圈最大半径
    radiusMin: 100,//圆圈最小半径
  }) {
    if (point)
      this.setPoint(point)
    this._config = config
  }

  //设置坐标数组
  setPoint(point, onlyZombie = false) {
    if (!onlyZombie)
      this._point = copyArrayObject(point)//原始数据
    this._pointZombie = copyArrayObject(point)//用于计算 排序啥的 会更改位置 就叫它僵尸数组吧
  }

  //获取处理后的标记数据
  getGatherCirclesArray() {
    var roundList = []
    var thisRound = {}
    var gatherCircles = new GatherCircles(this._pointZombie, this._config)
    do {
      thisRound = gatherCircles[this._config.mode]()
      roundList.push(thisRound)
    } while (thisRound.other.length)
    return roundList
  }

  //获取聚集圈集合友好输出 //圈    中心点
  getGatherCirclesFriendly(circles_, circlesMarkers_) {
    var circlesArray = []
    var circlesMarkersArray = []
    var gatherCirclesArray = this.getGatherCirclesArray()
    gatherCirclesArray.forEach((element, i) => {
      //画圆
      var circles = Object.assign({}, circles_)
      circles.latitude = element.data[0].latitude
      circles.longitude = element.data[0].longitude
      circles.radius = element.data[element.data.length - 1].m
      if (circles.radius < this._config.radiusMin) circles.radius = this._config.radiusMin
      circlesArray.push(Object.assign({}, circles))

      //下标签
      var circlesMarkers = Object.assign({}, circlesMarkers_)
      circlesMarkers.callout = Object.assign({}, circlesMarkers_.callout)
      circlesMarkers.id = i
      circlesMarkers.latitude = element.data[0].latitude
      circlesMarkers.longitude = element.data[0].longitude
      circlesMarkers.callout.content = circlesMarkers.callout.content.replace("{num}", element.data.length)
      circlesMarkersArray.push(Object.assign({}, circlesMarkers))
      delete element.other
    });

    return {
      point: this._point,
      gatherCirclesArray: gatherCirclesArray,
      circles: circlesArray,
      circlesMarkers: circlesMarkersArray
    }
  }
}

module.exports = {
  Pollen: Pollen,
}