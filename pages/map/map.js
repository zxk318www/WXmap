// pages/map/map.js

//获取应用实例
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js')
var qqmapsdk;

Page({
  data: {
    longitude: 116.4965075,
    latitude: 40.006103,
    speed: 0,
    accuracy: 0,
    markers: [],

    inputShowed: false,
    inputVal: ""
  },
  //事件处理函数
  bindViewTap: function () {

  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
    console.log(e.detail.value)
  },

  onLoad: function () {
    var that = this
    wx.showLoading({
      title: "定位中",
      mask: true
    })
    wx.getLocation({
      type: 'gcj02',
      altitude: true,//高精度定位
      //定位成功，更新定位结果
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy

        that.setData({
          longitude: longitude,
          latitude: latitude,
          speed: speed,
          accuracy: accuracy
        })
      },
      //定位失败回调
      fail: function () {
        wx.showToast({
          title: "定位失败",
          icon: "none"
        })
      },

      complete: function () {
        //隐藏定位中信息进度
        wx.hideLoading()
      }

    })
    qqmapsdk = new QQMapWX({
      key: '你申请的key'
    })
  },
  onShow() {
    var that = this
    console.log(that.data.latitude);
    //调用

  },
  search() {
    qqmapsdk.search({
      keyword: '酒店',

      success: function (res) {
        console.log(res);
        var mks = []
        for (var i = 0; i < res.data.length; i++) {
          mks.push({
            title: res.data[i].title,
            id: res.data[i].id,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,
            iconPath: '../../img/marker_red.png',
            width: 20,
            height: 20
          })
        }
        that.setData({
          markers: mks
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        //console.log(res);
      }
    })
  }
})
