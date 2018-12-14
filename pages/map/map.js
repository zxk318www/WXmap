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
    polyline: [],

    inputShowed: false,
    inputVal: "",
    searchResults: [], //搜索框提示信息

    toLat: 0, //目的地的维度
    toLng: 0, //目的地的经度
    distance: 0 //目的地距离,单位米
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
    this.setData({
      markers: [],
      polyline:[]
    })
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
              content: res.data[i].title + '\n' + '(' + res.data[i].address + ')' || '',
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
       
      }
    })
  },
  //搜索提示搜索关键字
  inputTips(param) {
    var that = this

    qqmapsdk.getSuggestion({
      keyword: param,
      success: function (res) {
        // console.log(res)
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
    //console.log(e.currentTarget.dataset.object);
    this.setData({
      markers: [],
      polyline:[]
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
        content: obj.title + '\n' + '(' + obj.address + ')' || '',
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
    this.setData({
      markers: mks,
      toLat:selmk.latitude,
      toLng:selmk.longitude
    })
    this.jsJL(obj.location.lat, obj.location.lng);
    this.hideInput();
  },
  //附近
  getPoint() {
    var that = this
    that.setData({
      markers: [],
      polyline:[]
    })
    wx.chooseLocation({

      success: function (res) {
        //console.log(res)
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
            content: res.name + '\n' + '(' + res.address + ')' || '',
            fontSize: 12,
            bgColor: "#FFF",
            borderWidth: 1,
            borderColor: "#CCC",
            padding: 4,

            textAlign: "center"
          }
        }
        mks.push(selmk);
        //console.log(mks);
        that.setData({
          markers: mks
        })
        that.jsJL(res.latitude, res.longitude);
      }, complete() {

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
  tapMark(e) {
    console.log(e)
    var mks = this.data.markers
    console.log(mks)
    var that = this
    for(var i=0;i<mks.length;i++){
      if(mks[i].id==e.markerId){
        that.setData({
          toLat:mks[i].latitude,
          toLng:mks[i].longitude
        })
        that.jsJL(mks[i].latitude, mks[i].longitude);
      }
    }
    
  },
  //计算距离
  jsJL(lat, lng) {
    var that = this
    qqmapsdk.calculateDistance({
      to: [{
        latitude: lat,
        longitude: lng
      }],
      success: function (res) {
        console.log(res);
        that.setData({
          toLat: res.result.elements[0].to.lat,
          toLng: res.result.elements[0].to.lng,
          distance: res.result.elements[0].distance
        })
      }
    })
  },
  //规划路线
  guihua(e) {
    var that = this
    this.setData({
      polyline:[]
    })
    console.log(e.currentTarget.dataset.type)
    var type = e.currentTarget.dataset.type
    var loclat = this.data.latitude
    var loclng = this.data.longitude
    var tolat = this.data.toLat
    var tolng = this.data.toLng
    var url = ""
    if (type == 3) {
      url = "https://apis.map.qq.com/ws/direction/v1/driving/"
    }
    if (type == 2) {
      url = "https://apis.map.qq.com/ws/direction/v1/bicycling/"
    }
    if (type == 1) {
      url = "https://apis.map.qq.com/ws/direction/v1/walking/"
    }
    wx.request({
      url: `${url}?from=${loclat},${loclng}&to=${tolat},${tolng}&key=WFUBZ-OEVC5-APXIL-QQKAH-7NFZE-3WFYU`,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        console.log(res)
        var ret = res.data
        if (ret.status != 0) return; //服务异常处理
        var coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        //设置polyline属性，将路线显示出来
        that.setData({
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 2
          }]
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
})
