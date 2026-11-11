package com.todo.api;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/todos")
public class TodoController {
    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping
    public List<Todo> findAll() {
        return todoService.findAll();
    }

    @PostMapping
    public ResponseEntity<Todo> create(@Valid @RequestBody CreateTodoRequest request) {
        return ResponseEntity.status(201).body(todoService.create(request));
    }

    @PatchMapping("/{id}/toggle")
    public Todo toggle(@PathVariable long id) {
        return todoService.toggle(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable long id) {
        todoService.remove(id);
        return ResponseEntity.ok().build();
    }
}
