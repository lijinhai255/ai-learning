package com.todo.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class TodoApplication {
    public static void main(String[] args) {
        SpringApplication.run(TodoApplication.class, args);
    }

    @Bean
    WebMvcConfigurer corsConfiguration() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOriginPatterns("*")
                    .allowedMethods("GET", "POST", "PATCH", "DELETE", "OPTIONS")
                    .allowedHeaders("*");
            }
        };
    }
}
