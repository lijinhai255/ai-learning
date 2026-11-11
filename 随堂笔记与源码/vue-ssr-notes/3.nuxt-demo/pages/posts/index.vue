<script setup lang="ts">
// 现在我们需要从服务端获取内容
import { useFetch } from "nuxt/app";
import { computed } from "vue";
const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

interface Data {
  id: string;
  title: string;
  content: string;
}

interface Topics<T extends Data = Data> {
  success: boolean;
  data: T[];
}

const { data } = useFetch<Topics>("https://cnodejs.org/api/v1/topics", {
  headers: {
    "content-type": "application/json",
  },
});

// 派生结果
const topics = computed(() => {
  if (!data.value) return [];
  return data.value.data;
});
</script>

<template>
  <div>
    <div v-for="topic in topics" v-bind:key="topic.id">
      <NuxtLink :to="`/posts/${topic.id}`">{{ topic.title }}</NuxtLink>
    </div>
  </div>
</template>
