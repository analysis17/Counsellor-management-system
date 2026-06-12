package com.duty.backend.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * 值班安排实体类
 */
@Data
@TableName("duty_schedule")
public class DutySchedule {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long userId;
    
    private Long collegeId;
    
    private LocalDate dutyDate;
    
    private LocalTime startTime;
    
    private LocalTime endTime;
    
    private String location;
    
    private String remark;
    
    private Integer status;
    
    private Integer deleted;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    @TableField(exist = false)
    private String userName;
    
    @TableField(exist = false)
    private String collegeName;
}