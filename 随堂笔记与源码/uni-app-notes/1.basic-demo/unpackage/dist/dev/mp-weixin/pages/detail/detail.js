"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  setup() {
    const newTodo = common_vendor.ref("");
    const todos = common_vendor.ref([]);
    const addTodo = () => {
      if (newTodo.value) {
        todos.value.push(newTodo.value);
        newTodo.value = "";
        common_vendor.index.setStorageSync("todos", todos.value);
      }
    };
    const removeTodo = (index) => {
      todos.value.splice(index, 1);
      common_vendor.index.setStorageSync("todos", todos.value);
    };
    common_vendor.onMounted(() => {
      const storedTodos = common_vendor.index.getStorageSync("todos");
      if (storedTodos) {
        todos.value = storedTodos;
      }
    });
    return {
      newTodo,
      todos,
      addTodo,
      removeTodo
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $setup.addTodo && $setup.addTodo(...args)),
    b: $setup.newTodo,
    c: common_vendor.o(($event) => $setup.newTodo = $event.detail.value),
    d: common_vendor.f($setup.todos, (todo, index, i0) => {
      return {
        a: common_vendor.t(todo),
        b: common_vendor.o(($event) => $setup.removeTodo(index), index),
        c: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
