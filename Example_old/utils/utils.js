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