package com.duty.backend.dto;

import lombok.Data;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * 值班安排DTO
 */
@Data
public class DutyScheduleDTO {
    private Long id;
    
    @NotNull(message = "用户ID不能为空")
    private Long userId;
    
    @NotNull(message = "学院ID不能为空")
    private Long collegeId;
    
    @NotNull(message = "值班日期不能为空")
    private LocalDate dutyDate;
    
    @NotNull(message = "开始时间不能为空")
    private LocalTime startTime;
    
    @NotNull(message = "结束时间不能为空")
    private LocalTime endTime;
    
    private String location;
    
    private String remark;
}