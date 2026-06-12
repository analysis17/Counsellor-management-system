package com.duty.backend.dto;

import lombok.Data;
import javax.validation.constraints.NotNull;

/**
 * 换班申请DTO
 */
@Data
public class ExchangeRequestDTO {
    private Long id;
    
    @NotNull(message = "申请人值班安排ID不能为空")
    private Long fromScheduleId;
    
    @NotNull(message = "被申请人值班安排ID不能为空")
    private Long toScheduleId;
    
    private String reason;
}