package com.duty.backend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.duty.backend.dto.LoginDTO;
import com.duty.backend.dto.Result;
import com.duty.backend.entity.User;
import com.duty.backend.mapper.UserMapper;
import com.duty.backend.service.UserService;
import com.duty.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    public Result<?> login(LoginDTO loginDTO) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, loginDTO.getUsername());
        wrapper.eq(User::getDeleted, 0);
        User user = this.getOne(wrapper);
        
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        if (!user.getPassword().equals(loginDTO.getPassword())) {
            return Result.error("密码错误");
        }
        
        String token = jwtUtil.generateToken(user.getId());
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", user);
        return Result.success("登录成功", data);
    }
    
    @Override
    public Result<?> getCurrentUser(Long userId) {
        User user = this.getById(userId);
        if (user == null) {
            return Result.error("用户不存在");
        }
        return Result.success(user);
    }
    
    @Override
    public Result<?> switchRole(Long userId, String role) {
        User user = this.getById(userId);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        // 验证角色是否有效
        if (!role.equals("COUNSELOR") && !role.equals("COLLEGE") && !role.equals("ADMIN")) {
            return Result.error("无效的角色类型");
        }
        
        user.setRole(role);
        this.updateById(user);
        return Result.success("角色切换成功", user);
    }
}