import { ref } from "vue";
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);

  const handleAdd = () => {
    count.value++;
  };

  return { count, handleAdd };
});
