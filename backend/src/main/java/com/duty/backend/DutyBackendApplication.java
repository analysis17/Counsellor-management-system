package com.duty.backend;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.duty.backend.mapper")
public class DutyBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(DutyBackendApplication.class, args);
    }
}