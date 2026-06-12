package com.duty.backend.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 换班申请实体类
 */
@Data
@TableName("exchange_request")
public class ExchangeRequest {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 申请换班的辅导员ID
     */
    private Long fromUserId;
    
    /**
     * 被申请换班的辅导员ID
     */
    private Long toUserId;
    
    /**
     * 申请换班的值班安排ID
     */
    private Long fromScheduleId;
    
    /**
     * 被申请换班的值班安排ID
     */
    private Long toScheduleId;
    
    /**
     * 换班原因
     */
    private String reason;
    
    /**
     * 状态：PENDING-待处理, ACCEPTED-被申请人已同意, REJECTED-被申请人已拒绝, APPROVED-管理员已批准, COMPLETED-已完成
     */
    private String status;
    
    /**
     * 是否跨学院
     */
    private Integer isCrossCollege;
    
    private Integer deleted;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    @TableField(exist = false)
    private String fromUserName;
    
    @TableField(exist = false)
    private String toUserName;
    
    @TableField(exist = false)
    private String fromScheduleInfo;
    
    @TableField(exist = false)
    private String toScheduleInfo;
}