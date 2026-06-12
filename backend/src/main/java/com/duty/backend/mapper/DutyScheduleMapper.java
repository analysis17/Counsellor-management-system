package com.duty.backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.duty.backend.entity.DutySchedule;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface DutyScheduleMapper extends BaseMapper<DutySchedule> {
    
    @Select("SELECT ds.*, u.name as user_name, c.name as college_name " +
            "FROM duty_schedule ds " +
            "LEFT JOIN sys_user u ON ds.user_id = u.id " +
            "LEFT JOIN sys_college c ON ds.college_id = c.id " +
            "WHERE ds.deleted = 0 AND ds.duty_date = #{date}")
    List<DutySchedule> selectByDate(String date);
    
    @Select("SELECT ds.*, u.name as user_name, c.name as college_name " +
            "FROM duty_schedule ds " +
            "LEFT JOIN sys_user u ON ds.user_id = u.id " +
            "LEFT JOIN sys_college c ON ds.college_id = c.id " +
            "WHERE ds.deleted = 0 AND ds.user_id = #{userId} AND ds.duty_date >= CURDATE()")
    List<DutySchedule> selectByUserId(Long userId);
    
    @Select("SELECT ds.*, u.name as user_name, c.name as college_name " +
            "FROM duty_schedule ds " +
            "LEFT JOIN sys_user u ON ds.user_id = u.id " +
            "LEFT JOIN sys_college c ON ds.college_id = c.id " +
            "WHERE ds.deleted = 0 AND ds.user_id = #{userId}")
    List<DutySchedule> selectAllByUserId(Long userId);
    
    @Select("SELECT ds.*, u.name as user_name, c.name as college_name " +
            "FROM duty_schedule ds " +
            "LEFT JOIN sys_user u ON ds.user_id = u.id " +
            "LEFT JOIN sys_college c ON ds.college_id = c.id " +
            "WHERE ds.deleted = 0 AND ds.college_id = #{collegeId}")
    List<DutySchedule> selectByCollegeId(Long collegeId);
}