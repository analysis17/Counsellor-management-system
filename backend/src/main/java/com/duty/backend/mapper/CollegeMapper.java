package com.duty.backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.duty.backend.entity.College;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CollegeMapper extends BaseMapper<College> {
}