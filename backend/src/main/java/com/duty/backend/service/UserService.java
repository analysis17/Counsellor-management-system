package com.duty.backend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.duty.backend.dto.LoginDTO;
import com.duty.backend.entity.User;
import com.duty.backend.dto.Result;

public interface UserService extends IService<User> {
    Result<?> login(LoginDTO loginDTO);
    Result<?> getCurrentUser(Long userId);
    Result<?> switchRole(Long userId, String role);
}