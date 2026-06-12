package com.duty.backend.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.duty.backend.dto.Result;
import com.duty.backend.entity.User;
import com.duty.backend.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    
    @Autowired
    private UserMapper userMapper;
    
    @GetMapping("/list")
    public Result<?> list() {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getDeleted, 0);
        List<User> list = userMapper.selectList(wrapper);
        return Result.success(list);
    }
    
    @GetMapping("/counselors")
    public Result<?> getCounselors() {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getDeleted, 0);
        wrapper.eq(User::getRole, "COUNSELOR");
        List<User> list = userMapper.selectList(wrapper);
        return Result.success(list);
    }
    
    @PostMapping("/add")
    public Result<?> add(@RequestBody User user) {
        user.setDeleted(0);
        userMapper.insert(user);
        return Result.success("添加成功", user);
    }
    
    @PutMapping("/update")
    public Result<?> update(@RequestBody User user) {
        userMapper.updateById(user);
        return Result.success("更新成功", user);
    }
    
    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        User user = userMapper.selectById(id);
        if (user != null) {
            user.setDeleted(1);
            userMapper.updateById(user);
        }
        return Result.success("删除成功");
    }
    
    @PutMapping("/restore/{id}")
    public Result<?> restore(@PathVariable Long id) {
        User user = userMapper.selectById(id);
        if (user != null) {
            user.setDeleted(0);
            userMapper.updateById(user);
            return Result.success("恢复成功", user);
        }
        return Result.success("用户不存在");
    }
}