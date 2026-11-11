<script setup lang="ts">
import { computed, ref } from 'vue';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const todos = ref<Todo[]>([
  { id: 1, title: '拆解产品需求', completed: true },
  { id: 2, title: '建立 React + Vue + NestJS 工程', completed: false },
]);
const title = ref('');
const remainingCount = computed(() => todos.value.filter((todo) => !todo.completed).length);

function addTodo() {
  const trimmedTitle = title.value.trim();
  if (!trimmedTitle) return;
  todos.value.push({ id: Date.now(), title: trimmedTitle, completed: false });
  title.value = '';
}

function removeTodo(id: number) {
  todos.value = todos.value.filter((todo) => todo.id !== id);
}
</script>

<template>
  <main class="todo-shell">
    <section class="todo-card" aria-labelledby="page-title">
      <p class="eyebrow">@todo/web-vue</p>
      <h1 id="page-title">今日待办</h1>
      <p class="summary">还有 {{ remainingCount }} 项任务待完成</p>

      <form class="todo-form" @submit.prevent="addTodo">
        <label class="sr-only" for="new-todo">新待办</label>
        <input id="new-todo" v-model="title" placeholder="添加一项待办..." />
        <button type="submit">添加</button>
      </form>

      <ul class="todo-list" aria-label="待办列表">
        <li v-for="todo in todos" :key="todo.id" class="todo-row">
          <label>
            <input v-model="todo.completed" type="checkbox" />
            <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
          </label>
          <button class="delete-button" type="button" @click="removeTodo(todo.id)">删除</button>
        </li>
      </ul>
    </section>
  </main>
</template>
