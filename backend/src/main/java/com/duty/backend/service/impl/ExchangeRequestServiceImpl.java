package com.duty.backend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.duty.backend.dto.ExchangeRequestDTO;
import com.duty.backend.dto.Result;
import com.duty.backend.entity.DutySchedule;
import com.duty.backend.entity.ExchangeRequest;
import com.duty.backend.entity.User;
import com.duty.backend.mapper.ExchangeRequestMapper;
import com.duty.backend.service.DutyScheduleService;
import com.duty.backend.service.ExchangeRequestService;
import com.duty.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExchangeRequestServiceImpl extends ServiceImpl<ExchangeRequestMapper, ExchangeRequest> implements ExchangeRequestService {
    
    @Autowired
    private DutyScheduleService dutyScheduleService;
    
    @Autowired
    private UserService userService;
    
    @Override
    public Result<?> getPendingRequests(Long userId) {
        List<ExchangeRequest> list = baseMapper.selectPendingByToUserId(userId);
        return Result.success(list);
    }
    
    @Override
    public Result<?> getAcceptedRequests() {
        List<ExchangeRequest> list = baseMapper.selectAcceptedRequests();
        return Result.success(list);
    }
    
    @Override
    @Transactional
    public Result<?> apply(ExchangeRequestDTO dto, Long fromUserId) {
        DutySchedule fromSchedule = dutyScheduleService.getById(dto.getFromScheduleId());
        DutySchedule toSchedule = dutyScheduleService.getById(dto.getToScheduleId());
        
        if (fromSchedule == null || toSchedule == null) {
            return Result.error("值班安排不存在");
        }
        
        // 检查是否是自己的值班
        if (!fromSchedule.getUserId().equals(fromUserId)) {
            return Result.error("只能申请换自己的值班");
        }
        
        // 检查是否跨学院
        User fromUser = userService.getById(fromUserId);
        User toUser = userService.getById(toSchedule.getUserId());
        Integer isCrossCollege = fromUser.getCollegeId().equals(toUser.getCollegeId()) ? 0 : 1;
        
        ExchangeRequest request = new ExchangeRequest();
        request.setFromUserId(fromUserId);
        request.setToUserId(toSchedule.getUserId());
        request.setFromScheduleId(dto.getFromScheduleId());
        request.setToScheduleId(dto.getToScheduleId());
        request.setReason(dto.getReason());
        request.setStatus("PENDING");
        request.setIsCrossCollege(isCrossCollege);
        request.setDeleted(0);
        this.save(request);
        
        return Result.success("申请已提交", request);
    }
    
    @Override
    @Transactional
    public Result<?> accept(Long id, Long toUserId) {
        ExchangeRequest request = this.getById(id);
        if (request == null) {
            return Result.error("申请不存在");
        }
        
        if (!request.getToUserId().equals(toUserId)) {
            return Result.error("无权处理此申请");
        }
        
        request.setStatus("ACCEPTED");
        request.setUpdateTime(LocalDateTime.now());
        this.updateById(request);
        
        return Result.success("已同意换班申请", request);
    }
    
    @Override
    @Transactional
    public Result<?> reject(Long id, Long toUserId) {
        ExchangeRequest request = this.getById(id);
        if (request == null) {
            return Result.error("申请不存在");
        }
        
        if (!request.getToUserId().equals(toUserId)) {
            return Result.error("无权处理此申请");
        }
        
        request.setStatus("REJECTED");
        request.setUpdateTime(LocalDateTime.now());
        this.updateById(request);
        
        return Result.success("已拒绝换班申请");
    }
    
    @Override
    @Transactional
    public Result<?> approve(Long id) {
        ExchangeRequest request = this.getById(id);
        if (request == null) {
            return Result.error("申请不存在");
        }
        
        if (!request.getStatus().equals("ACCEPTED")) {
            return Result.error("只能审批已同意的申请");
        }
        
        // 交换值班安排的用户ID
        DutySchedule fromSchedule = dutyScheduleService.getById(request.getFromScheduleId());
        DutySchedule toSchedule = dutyScheduleService.getById(request.getToScheduleId());
        
        Long tempUserId = fromSchedule.getUserId();
        fromSchedule.setUserId(toSchedule.getUserId());
        toSchedule.setUserId(tempUserId);
        
        dutyScheduleService.updateById(fromSchedule);
        dutyScheduleService.updateById(toSchedule);
        
        request.setStatus("COMPLETED");
        request.setUpdateTime(LocalDateTime.now());
        this.updateById(request);
        
        return Result.success("审批成功，换班已完成");
    }
    
    @Override
    public Result<?> getHistory(Long userId) {
        LambdaQueryWrapper<ExchangeRequest> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ExchangeRequest::getDeleted, 0);
        wrapper.and(w -> w.eq(ExchangeRequest::getFromUserId, userId)
                .or().eq(ExchangeRequest::getToUserId, userId));
        wrapper.orderByDesc(ExchangeRequest::getCreateTime);
        return Result.success(this.list(wrapper));
    }
}