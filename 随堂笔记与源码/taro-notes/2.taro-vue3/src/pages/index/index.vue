<template>
  <view class="index">
    <text>{{ msg }}---{{ router.params.name }}</text>
  </view>
</template>

<!-- <script>
import { ref } from "vue";
import { useRouter } from "@tarojs/taro";
import "./index.scss";

export default {
  setup() {
    const msg = ref("Hello world");
    return {
      msg,
    };
  },
};
</script> -->

<script setup>
import { ref } from "vue";
import { useRouter } from "@tarojs/taro";
import "./index.scss";

const msg = ref("Hello world");
const router = useRouter();

console.log(router.params);
</script>
