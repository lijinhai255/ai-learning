
Component({
  data: {
    message: 'hello user',
    // topics: [{
    //   id: "123"
    // }]
    topics: []
  },
  lifetimes: {
    created: function() {
      console.log('created')
      // // 创建 WebSocket 连接
      // const socketTask = wx.connectSocket({
      //   url: 'ws://localhost:3000', // WebSocket 服务器地址
      //   header: {
      //     'content-type': 'application/json'
      //   },
      //   protocols: [], // 可选的子协议
      //   success() {
      //     console.log('WebSocket 连接成功');
      //   },
      //   fail(err) {
      //     console.error('WebSocket 连接失败：', err);
      //   }
      // });

      // // 监听 WebSocket 连接打开事件
      // socketTask.onOpen(function () {
      //   console.log('WebSocket 连接已打开');
      //   // 连接成功后可以通过 socketTask.send 发送数据
      //   socketTask.send({
      //     data: JSON.stringify({ action: 'login', user: 'user123' }),
      //     success() {
      //       console.log('消息发送成功');
      //     }
      //   });
      // });

      // // 监听服务器发送的消息
      // socketTask.onMessage(function (res) {
      //   console.log('收到服务器消息：', res.data);
      //   // 可以根据消息内容进行对应的业务处理
      // });

      // // 监听 WebSocket 关闭事件
      // socketTask.onClose(function (res) {
      //   console.log('WebSocket 连接已关闭', res);
      // });

      // // 监听 WebSocket 错误事件
      // socketTask.onError(function (err) {
      //   console.error('WebSocket 错误：', err);
      // });


      // 一般文件都是从图片或者是视频选择而来的
      // wx.chooseImage({count: 1, success(res) {
      //   console.log(res)
      //   const tempFilePaths = res.tempFilePaths[0]

      //   // 文件上传
      //   wx.uploadFile({
      //     url: "http://localhost:8000",
      //     filePath: tempFilePaths,
      //     name: "file",
      //     formData: {
      //       user: 'heyi'
      //     }
      //   })
      // }})
    },
    attached: function() {
      // 在组件实例进入页面节点树时执行
      console.log('mount')

      // 请求发送
      wx.request({
        url: "https://cnodejs.org/api/v1/topics",
        method: 'GET',
        success:(res) =>{
          const json = res.data
          this.setData({
            ...this.data,
            topics: json.data
          })
          console.log(json)
        },
        fail(err) {
          console.log(err)
        }
      })
    },
    ready: function () {
      console.log('ready')
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
      console.log("unmount")
    },
  },
  methods: {
    toLogs() {
      wx.navigateTo({
        // url: '/pages/logs/logs',
        url: '../logs/logs',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromOpenedPage: function(data) {
            console.log(data)
          },
          someEvent: function(data) {
            console.log(data)
          }
        },
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
        }
      })
    }
  }
})

console.log(wx.env)
console.log(wx.canIUse('console.log'))
console.log(wx.getDeviceInfo())
console.log(wx.getWindowInfo())
