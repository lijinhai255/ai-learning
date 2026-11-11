package com.todo.api;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class TodoApiIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TodoService todoService;

    @BeforeEach
    void resetData() {
        todoService.reset();
    }

    @Test
    void 健康检查和待办主流程符合HTTP契约() throws Exception {
        mockMvc.perform(get("/health"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("ok"))
            .andExpect(jsonPath("$.service").value("todo-api"));

        mockMvc.perform(get("/todos"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[0].title").value("拆解产品需求"));

        String response = mockMvc.perform(post("/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"  验证自动验收  \",\"ignored\":true}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.title").value("验证自动验收"))
            .andExpect(jsonPath("$.completed").value(false))
            .andReturn()
            .getResponse()
            .getContentAsString();

        long id = JsonTestValues.readLong(response, "id");

        mockMvc.perform(patch("/todos/{id}/toggle", id))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.completed").value(true));

        mockMvc.perform(delete("/todos/{id}", id))
            .andExpect(status().isOk())
            .andExpect(content().string(""));

        mockMvc.perform(get("/todos"))
            .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void 非法输入和未知待办返回可识别错误() throws Exception {
        mockMvc.perform(post("/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"   \"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));

        mockMvc.perform(post("/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"" + "a".repeat(201) + "\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));

        mockMvc.perform(patch("/todos/999/toggle"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.code").value("TODO_NOT_FOUND"));

        mockMvc.perform(delete("/todos/999"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.code").value("TODO_NOT_FOUND"));
    }
}
