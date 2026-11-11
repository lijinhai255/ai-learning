<template>
  <view class="user">
    <text>{{ msg }}</text>
    <view class="img-wrapper">
      <image src="https://docs.taro.zone/img/logo-taro.png" />
    </view>
    <button @tap="goto">按钮</button>
  </view>
</template>

<!-- <script>
import { ref } from 'vue'
import './index.scss'

export default {
  setup () {
    const msg = ref('Hello world')
    return {
      msg
    }
  }
}
</script> -->
<script setup>
import { ref } from "vue";
import Taro from "@tarojs/taro";
import "./index.scss";

const msg = ref("Hello User");

const goto = () => {
  console.log("goto");
  Taro.navigateTo({
    url: "/pages/index/index?name=heyi",
  });
};
</script>
