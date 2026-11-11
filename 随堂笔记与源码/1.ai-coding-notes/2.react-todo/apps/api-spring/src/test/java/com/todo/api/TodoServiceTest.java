package com.todo.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class TodoServiceTest {
    private TodoService todoService;

    @BeforeEach
    void setUp() {
        todoService = new TodoService();
    }

    @Test
    void 创建待办时会去除首尾空格且默认为未完成() {
        Todo todo = todoService.create(new CreateTodoRequest("  write tests  "));

        assertThat(todo.title()).isEqualTo("write tests");
        assertThat(todo.completed()).isFalse();
    }

    @Test
    void toggle会在两次调用后恢复原状态() {
        boolean initialState = todoService.findAll().get(0).completed();

        assertThat(todoService.toggle(1L).completed()).isNotEqualTo(initialState);
        assertThat(todoService.toggle(1L).completed()).isEqualTo(initialState);
    }

    @Test
    void 操作不存在的待办会抛出领域异常() {
        assertThatThrownBy(() -> todoService.toggle(999L))
            .isInstanceOf(TodoNotFoundException.class)
            .hasMessage("Todo 999 not found");
    }
}
