package com.duty.backend.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.duty.backend.dto.Result;
import com.duty.backend.entity.College;
import com.duty.backend.mapper.CollegeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/college")
public class CollegeController {
    
    @Autowired
    private CollegeMapper collegeMapper;
    
    @GetMapping("/list")
    public Result<?> list() {
        LambdaQueryWrapper<College> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(College::getDeleted, 0);
        List<College> list = collegeMapper.selectList(wrapper);
        return Result.success(list);
    }
}