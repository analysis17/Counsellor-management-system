package com.duty.backend.controller;

import com.duty.backend.dto.LoginDTO;
import com.duty.backend.dto.Result;
import com.duty.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/login")
    public Result<?> login(@Valid @RequestBody LoginDTO loginDTO) {
        try {
            return userService.login(loginDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "服务器内部错误: " + e.getMessage());
        }
    }
    
    @GetMapping("/current")
    public Result<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        // 从token中获取用户ID
        Long userId = getUserIdFromToken(token);
        return userService.getCurrentUser(userId);
    }
    
    @PostMapping("/switch-role")
    public Result<?> switchRole(@RequestHeader("Authorization") String token, 
                                @RequestParam String role) {
        Long userId = getUserIdFromToken(token);
        return userService.switchRole(userId, role);
    }
    
    private Long getUserIdFromToken(String token) {
        // 简单实现，实际应该使用JwtUtil
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        // 这里应该调用JwtUtil解析token
        return 1L; // 临时返回
    }
}