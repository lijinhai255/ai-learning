package com.todo.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

final class JsonTestValues {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private JsonTestValues() {}

    static long readLong(String json, String field) throws Exception {
        JsonNode node = OBJECT_MAPPER.readTree(json).get(field);
        return node.longValue();
    }
}
