"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      background: ["color1", "color2", "color3"],
      indicatorDots: true,
      autoplay: true,
      interval: 2e3,
      duration: 500,
      topics: []
    };
  },
  onLoad() {
    common_vendor.index.__f__("log", "at pages/user/user.vue:51", "Page onLoad");
    this.fetchData();
  },
  onReady() {
    common_vendor.index.__f__("log", "at pages/user/user.vue:55", "Page onReady");
  },
  onShow() {
    common_vendor.index.__f__("log", "at pages/user/user.vue:58", "Page onShow");
  },
  beforeCreate() {
    common_vendor.index.__f__("log", "at pages/user/user.vue:61", "Component beforeCreate");
  },
  created() {
    common_vendor.index.__f__("log", "at pages/user/user.vue:64", "Component created");
  },
  beforeMount() {
    common_vendor.index.__f__("log", "at pages/user/user.vue:67", "Component beforeMount");
  },
  mounted() {
    common_vendor.index.__f__("log", "at pages/user/user.vue:70", "Component mounted");
  },
  methods: {
    changeIndicatorDots(e) {
      this.indicatorDots = !this.indicatorDots;
    },
    changeAutoplay(e) {
      this.autoplay = !this.autoplay;
    },
    intervalChange(e) {
      this.interval = e.target.value;
    },
    durationChange(e) {
      this.duration = e.target.value;
    },
    fetchData() {
      common_vendor.index.request({
        url: "https://cnodejs.org/api/v1/topics",
        method: "GET",
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/user/user.vue:93", "请求成功", res.data);
          this.topics = res.data.data;
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/user/user.vue:97", "请求失败", err);
        }
      });
    },
    saveData() {
      common_vendor.index.setStorage({
        key: "key",
        data: "heyi",
        success: function() {
          common_vendor.index.__f__("log", "at pages/user/user.vue:106", "保存成功");
        }
      });
    },
    readData() {
      common_vendor.index.getStorage({
        key: "key",
        success: function(res) {
          common_vendor.index.__f__("log", "at pages/user/user.vue:114", "读取成功", res.data);
        }
      });
    },
    navigateTo() {
      common_vendor.index.navigateTo({
        url: "/pages/index/index"
        // url: '../index/index'
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.fetchData && $options.fetchData(...args)),
    b: common_vendor.o((...args) => $options.saveData && $options.saveData(...args)),
    c: common_vendor.o((...args) => $options.readData && $options.readData(...args)),
    d: common_vendor.o((...args) => $options.navigateTo && $options.navigateTo(...args)),
    e: common_vendor.f($data.topics, (topic, k0, i0) => {
      return {
        a: common_vendor.t(topic.title),
        b: topic.id
      };
    }),
    f: $data.indicatorDots,
    g: $data.autoplay,
    h: $data.interval,
    i: $data.duration
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/user.js.map
