module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1549898156705, function(require, module, exports) {
//计算坐标
var __TEMP__ = require('./utils/utils');var copyArrayObject = __TEMP__['copyArrayObject'];
var __TEMP__ = require('./utils/src/GatherCircles');var GatherCircles = __TEMP__['GatherCircles'];

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
}, function(modId) {var map = {"./utils/utils":1549898156706,"./utils/src/GatherCircles":1549898156707}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1549898156706, function(require, module, exports) {
//计算坐标
function getDisance(lat1, lng1, lat2, lng2) {
  var toRad = d => {
    return d * Math.PI / 180;
  }
  var dis = 0;
  var radLat1 = toRad(lat1);
  var radLat2 = toRad(lat2);
  var deltaLat = radLat1 - radLat2;
  var deltaLng = toRad(lng1) - toRad(lng2);
  var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
  return dis * 6378137;
}

//取中位数
function getMedian(arr) {
  arr = arr.sort()
  return arr[Math.round(arr.length / 2) - 1]
}

//深拷贝数组对象
function copyArrayObject(arrayObject) {
  return arrayObject.map(element => Object.assign({}, element))
}

//排序数组对象
function sortArrayObject(arr, objKey, order = 'asc') {
  return arr.sort(function (a, b) {
    return order == 'asc' ? a[objKey] - b[objKey] : b[objKey] - a[objKey]
  })
}

module.exports = {
  getDisance: getDisance,
  getMedian: getMedian,
  copyArrayObject: copyArrayObject,
  sortArrayObject: sortArrayObject
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1549898156707, function(require, module, exports) {
var __TEMP__ = require('../utils');var getMedian = __TEMP__['getMedian'];var getDisance = __TEMP__['getDisance'];var sortArrayObject = __TEMP__['sortArrayObject'];

class GatherCircles {
    //初始化
    constructor(_pointZombie, _config) {
        this._pointZombie = _pointZombie//随时可以变化的坐标数据 我称为僵尸坐标
        this._config = _config//配置
    }

    //中位数整合数据
    median() {
        //计算中位数
        var latitude = []
        var longitude = []
        this._pointZombie.forEach(element => {
            latitude.push(element.latitude)
            longitude.push(element.longitude)
        });
        var median = [getMedian(latitude), getMedian(longitude)]

        this._pointZombie.forEach(element => element.m = getDisance(median[0], median[1], element.latitude, element.longitude));
        this._pointZombie = sortArrayObject(this._pointZombie, 'm')

        //距离差距最小的为聚集点，重新计算每个点与聚集点的距离 然后重新排序
        this._pointZombie.forEach(element => element.m = getDisance(this._pointZombie[0].latitude, this._pointZombie[0].longitude, element.latitude, element.longitude));
        this._pointZombie = sortArrayObject(this._pointZombie, 'm')
        var thisRound = {
            data: [],
            other: []
        }
        this._pointZombie.forEach((element, i) => {
            element.m <= this._config.radiusMax ? thisRound.data.push(element) : thisRound.other.push(element)//范围内为一个group 其他未other
        });
        this._pointZombie = thisRound.other//将剩余的重新放入僵尸坐标
        return thisRound
    }

    //阶梯整合数据
    //每个点计算于每个点的距离 在配置最大范围内的为匹配点 匹配点数最多的作为中心
    ladder() {
        var thisRound = []
        this._pointZombie.forEach(elementI => {
            var num = 0
            var thisFor = {
                data: [],
                other: [],
                num: 0
            }
            this._pointZombie.forEach(elementJ => {
                elementJ.m = getDisance(elementI.latitude, elementI.longitude, elementJ.latitude, elementJ.longitude)
                if (elementJ.m <= this._config.radiusMax) {//判断是否为匹配点
                    thisFor.data.push(Object.assign({}, elementJ))
                    num++
                } else {
                    thisFor.other.push(Object.assign({}, elementJ))
                }
            })
            thisFor.num = num
            sortArrayObject(thisFor.data, 'm')
            thisRound.push(thisFor)
        })
        thisRound = sortArrayObject(thisRound, 'num', 'desc')
        this._pointZombie = thisRound[0].other//将剩余的重新放入僵尸坐标
        return {
            data: thisRound[0].data,
            other: thisRound[0].other,
        }
    }
}

module.exports = {
    GatherCircles: GatherCircles,
}
}, function(modId) { var map = {"../utils":1549898156706}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1549898156705);
})()
//# sourceMappingURL=index.js.map