<!-- <template>
  <text>{{ name }}</text>
  <button @click="handleClick">{{ name }}</button>
</template>

<script setup lang="ts">
import { ref } from "vue";
const name = ref("detail");

const handleClick = () => {
  console.log("click");
  name.value = "detail2";
};
</script> -->

<template>
  <view class="todo-container">
    <input v-model="newTodo" placeholder="添加待办事项" @confirm="addTodo" />
    <view v-for="(todo, index) in todos" :key="index" class="todo-item">
      <text>{{ todo }}</text>
      <button @click="removeTodo(index)">删除</button>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    // 响应式数据
    const newTodo = ref("");
    const todos = ref([]);

    // 添加待办事项
    const addTodo = () => {
      if (newTodo.value) {
        todos.value.push(newTodo.value);
        newTodo.value = "";
        uni.setStorageSync("todos", todos.value); // 存储到本地
      }
    };

    // 删除待办事项
    const removeTodo = (index) => {
      todos.value.splice(index, 1);
      uni.setStorageSync("todos", todos.value); // 更新本地存储
    };

    // 组件挂载时获取本地存储的数据
    onMounted(() => {
      const storedTodos = uni.getStorageSync("todos");
      if (storedTodos) {
        todos.value = storedTodos; // 初始化时获取本地存储的数据
      }
    });

    // 返回需要在模板中使用的变量和方法
    return {
      newTodo,
      todos,
      addTodo,
      removeTodo,
    };
  },
};
</script>

<style>
.todo-container {
  padding: 20px;
}
.todo-item {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
</style>
