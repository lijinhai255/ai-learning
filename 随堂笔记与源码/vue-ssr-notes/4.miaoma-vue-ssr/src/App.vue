<template>
  <h1>Hello SSR</h1>
  <ul>
    <li v-for="item in items" :key="item.id">{{ item.name }}</li>
  </ul>
  <div>{{ counterStore.count }}</div>
  <button @click="counterStore.increment">Increment</button>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view></router-view>
</template>

<script setup>
import { useCounterStore } from "./stores";
import { ref } from "vue";
const items = ref([
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
  { id: 3, name: "Cherry" },
]);

const counterStore = useCounterStore();
</script>
