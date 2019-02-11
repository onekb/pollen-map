import { getMedian, getDisance, sortArrayObject } from "../utils"

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