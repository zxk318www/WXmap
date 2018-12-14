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
    inputVal: "",
    searchResults: [] //搜索框提示信息
  },
  //事件处理函数
  bindViewTap: function () {
    console.log("bindViewTap")
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
    this.inputTips(e.detail.value)
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
      key: 'WFUBZ-OEVC5-APXIL-QQKAH-7NFZE-3WFYU'
    })
  },
  onShow() {
    var that = this
    console.log(that.data.latitude);
    //调用

  },
  search(param) {
    var that = this
    qqmapsdk.search({
      keyword: param,
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
            height: 20,
            callout: {
              content: res.data[i].title +'\n'+ '('+res.data[i].address+')' || '',
              fontSize: 12,
              bgColor: "#FFF",
              borderWidth: 1,
              borderColor: "#CCC",
              padding: 4,
             
              textAlign: "center"
            }
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
  },
  //搜索提示搜索关键字
  inputTips(param) {
    var that = this

    qqmapsdk.getSuggestion({
      keyword: param,
      success: function (res) {
        console.log(res)
        that.setData({
          searchResults: res.data
        })
      }
    })
  },
  clickImg(e) {
    //console.log(e.currentTarget.dataset.title);
    this.search(e.currentTarget.dataset.title);
  },
  select(e) {
    console.log(e.currentTarget.dataset.object);
    this.setData({
      markers: []
    })
    var obj = e.currentTarget.dataset.object;
    let mks = []
    var selmk = {
      title: obj.title,
      id: obj.id,
      latitude: obj.location.lat,
      longitude: obj.location.lng,
      iconPath: '../../img/marker_red.png',
      width: 20,
      height: 20,
      callout: {
        content: obj.title +'\n'+ '('+obj.address+')' || '',
        fontSize: 12,
        bgColor: "#FFF",
        borderWidth: 1,
        borderColor: "#CCC",
        padding: 4,
        display: "ALWAYS",
        textAlign: "center"
      }
    }
    mks.push(selmk);
    console.log(mks);
    this.setData({
      markers: mks
    })
    this.hideInput();
  },
  getPoint() {
    var that = this
    that.setData({
      markers: []
    })
    wx.chooseLocation({

      success: function (res) {
        console.log(res)
        let mks = []
        var selmk = {
          title: res.name,
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude,
          iconPath: '../../img/marker_red.png',
          width: 20,
          height: 20,

          callout: {
            content: res.name +'\n'+ '('+res.address+')' || '',
            fontSize: 12,
            bgColor: "#FFF",
            borderWidth: 1,
            borderColor: "#CCC",
            padding: 4,
            display: "ALWAYS",
            textAlign: "center"
          }
        }
        mks.push(selmk);
        //console.log(mks);
        that.setData({
          markers: mks
        })
      }

    })
  },
  //根据经纬度获取地址信息
  reverseGeocoder(lat, long) {
    var that = this
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: long
      },
      success: function (res) {
        console.log(res);

        let mks = []
        var selmk = {
          title: res.result.address,

          latitude: res.result.location.lat,
          longitude: res.result.location.lng,
          iconPath: '../../img/marker_red.png',
          width: 20,
          height: 20


        }
        mks.push(selmk);
        //console.log(mks);
        that.setData({
          markers: mks
        })
      }
    })
  },
  tapMark() {
    console.log("chumo")
  }
})
