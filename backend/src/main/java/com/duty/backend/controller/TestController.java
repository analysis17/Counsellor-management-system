package com.duty.backend.controller;

import com.duty.backend.dto.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @GetMapping("/hello")
    public Result<?> hello() {
        return Result.success("Backend is running!", "Hello from Duty System");
    }
    
    @PostMapping("/login-test")
    public Result<?> testLogin(@RequestBody String data) {
        return Result.success("Test login successful!", data);
    }
    
    @GetMapping("/reset-duties")
    public Result<?> resetDuties() {
        try {
            // 删除除了ID为5和6之外的所有记录
            jdbcTemplate.execute("DELETE FROM duty_schedule WHERE id NOT IN (5, 6)");
            
            // 将ID为5的记录更新为ID为1
            jdbcTemplate.execute("UPDATE duty_schedule SET id = 1 WHERE id = 5");
            
            // 将ID为6的记录更新为ID为2
            jdbcTemplate.execute("UPDATE duty_schedule SET id = 2 WHERE id = 6");
            
            // 重置自增计数器
            jdbcTemplate.execute("ALTER TABLE duty_schedule AUTO_INCREMENT = 3");
            
            return Result.success("值班表已重置完成");
        } catch (Exception e) {
            return Result.error("操作失败: " + e.getMessage());
        }
    }
    
    @PostMapping("/execute-sql")
    public Result<?> executeSql(@RequestBody String sql) {
        try {
            jdbcTemplate.execute(sql);
            return Result.success("SQL执行成功");
        } catch (Exception e) {
            return Result.error("SQL执行失败: " + e.getMessage());
        }
    }
}
