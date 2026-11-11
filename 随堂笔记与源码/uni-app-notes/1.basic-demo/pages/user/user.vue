<template>
  <view class="content">
    <text>Hello User</text>
  </view>
  <icon type="download" size="26" />
  <button @click="fetchData">请求数据</button>
  <!-- #ifdef MP-WEIXIN -->
  <button @click="saveData">保存数据</button>
  <button @click="readData">读取数据</button>
  <button @click="navigateTo">跳转到 index</button>
  <!-- #endif -->
  <ul>
    <li v-for="topic in topics" :key="topic.id">
      {{ topic.title }}
    </li>
  </ul>
  <swiper
    class="swiper"
    circular
    :indicator-dots="indicatorDots"
    :autoplay="autoplay"
    :interval="interval"
    :duration="duration"
  >
    <swiper-item>
      <view class="swiper-item uni-bg-red">A</view>
    </swiper-item>
    <swiper-item>
      <view class="swiper-item uni-bg-green">B</view>
    </swiper-item>
    <swiper-item>
      <view class="swiper-item uni-bg-blue">C</view>
    </swiper-item>
  </swiper>
</template>

<script>
export default {
  data() {
    return {
      background: ["color1", "color2", "color3"],
      indicatorDots: true,
      autoplay: true,
      interval: 2000,
      duration: 500,
      topics: [],
    };
  },
  // #ifdef MP-WEIXIN
  onLoad() {
    console.log("Page onLoad");
    this.fetchData();
  },
  onReady() {
    console.log("Page onReady");
  },
  onShow() {
    console.log("Page onShow");
  },
  beforeCreate() {
    console.log("Component beforeCreate");
  },
  created() {
    console.log("Component created");
  },
  beforeMount() {
    console.log("Component beforeMount");
  },
  mounted() {
    console.log("Component mounted");
  },

  // #endif

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
      uni.request({
        url: "https://cnodejs.org/api/v1/topics",
        method: "GET",
        success: (res) => {
          console.log("请求成功", res.data);
          this.topics = res.data.data;
        },
        fail: (err) => {
          console.error("请求失败", err);
        },
      });
    },
    saveData() {
      uni.setStorage({
        key: "key",
        data: "heyi",
        success: function () {
          console.log("保存成功");
        },
      });
    },
    readData() {
      uni.getStorage({
        key: "key",
        success: function (res) {
          console.log("读取成功", res.data);
        },
      });
    },
    navigateTo() {
      uni.navigateTo({
        url: "/pages/index/index",
        // url: '../index/index'
      });
    },
  },
};
</script>

<style>
/* #ifdef H5 */
.content {
  background-color: red;
}
/* #endif */
</style>