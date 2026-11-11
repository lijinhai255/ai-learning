package com.todo.api;

import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(TodoNotFoundException.class)
    ResponseEntity<ApiError> handleTodoNotFound(TodoNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ApiError(404, "TODO_NOT_FOUND", exception.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest()
            .body(new ApiError(400, "VALIDATION_ERROR", message));
    }

    @ExceptionHandler({
        HttpMessageNotReadableException.class,
        MethodArgumentTypeMismatchException.class
    })
    ResponseEntity<ApiError> handleMalformedRequest(Exception exception) {
        return ResponseEntity.badRequest()
            .body(new ApiError(400, "VALIDATION_ERROR", "Request is invalid"));
    }
}
