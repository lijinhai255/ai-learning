<script setup lang="ts">
import { ref } from "vue";
import { useFetch } from "nuxt/app";
// 为什么不需要导入？？？
// 如果有内容在编码的时候不用导入，那就一定是在编译的时候自动导入了
// Vue 宏定义，defineProps
const route = useRoute();

const { data } = useFetch("/api/hello");

const count = ref(0);

const id = route.params.id;

// 定义使用的中间件，来控制权限
definePageMeta({
  middleware: [
    function (to, from) {
      // Custom inline middleware
    },
    "auth",
  ],
});
</script>

<template>
  <NuxtLink to="/posts">返回列表</NuxtLink>
  <h1>详情 --- {{ id }}</h1>
  <h2>{{ data?.hello }}</h2>
  <div>
    {{ count }}
    <button @click="count++">点击 {{ count }}</button>
  </div>
</template>
