package com.todo.api;

public record ApiError(int statusCode, String code, String message) {}
