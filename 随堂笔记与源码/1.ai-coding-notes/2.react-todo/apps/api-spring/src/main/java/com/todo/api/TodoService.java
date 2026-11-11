package com.todo.api;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Service;

@Service
public class TodoService {
    private final Map<Long, Todo> todos = new LinkedHashMap<>();
    private final AtomicLong nextId = new AtomicLong(3);

    public TodoService() {
        reset();
    }

    public synchronized List<Todo> findAll() {
        return List.copyOf(todos.values());
    }

    public synchronized Todo create(CreateTodoRequest request) {
        Todo todo = new Todo(nextId.getAndIncrement(), request.title().trim(), false);
        todos.put(todo.id(), todo);
        return todo;
    }

    public synchronized Todo toggle(long id) {
        Todo todo = findById(id);
        Todo updated = new Todo(todo.id(), todo.title(), !todo.completed());
        todos.put(id, updated);
        return updated;
    }

    public synchronized void remove(long id) {
        if (todos.remove(id) == null) {
            throw new TodoNotFoundException(id);
        }
    }

    synchronized void reset() {
        todos.clear();
        todos.put(1L, new Todo(1L, "拆解产品需求", true));
        todos.put(2L, new Todo(2L, "建立 React + Vue + NestJS 工程", false));
        nextId.set(3);
    }

    private Todo findById(long id) {
        Todo todo = todos.get(id);
        if (todo == null) {
            throw new TodoNotFoundException(id);
        }
        return todo;
    }
}
