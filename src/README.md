# pollen
![](https://www.easyicon.net/api/resizeApi.php?id=172&size=128)
![](https://github.com/onekb/pollen-map/blob/master/img/1.jpg)

### 花粉
- 每个坐标点都像花粉那样聚焦蜜蜂

### 如何使用
```
npm i pollen
```
```
微信开发者工具 -> 工具 -> 构建npm
```
```
引入pollen-map
const Pollen = require('pollen-map')
```

```javascript
var pollen = new Pollen.Pollen(arr)//初始化pollen(放入初始数据)
var pollenData = pollen.getGatherCirclesFriendly(circles, circlesMarkers)//使用友好输出方式计算（放入配置好的圈/标记点）
```
或
```javascript
var pollen = new Pollen.Pollen()//初始化pollen
pollen.setPoint(arr)//放入初始数据
var pollenData = pollen.getGatherCirclesArray()//获取处理后的标记数据，需要自行处理
```

### 配置
直接操作属性pollen._config
```javascript
  _config = {
    mode: 'median',//归类方式median中位数 ladder阶梯
    radiusMax: 1000,//圆圈最大半径 单位米
    radiusMin: 100,//圆圈最小半径 单位米
  }//配置
```