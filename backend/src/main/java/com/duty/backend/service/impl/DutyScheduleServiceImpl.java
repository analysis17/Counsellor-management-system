package com.duty.backend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.duty.backend.dto.DutyScheduleDTO;
import com.duty.backend.dto.Result;
import com.duty.backend.entity.DutySchedule;
import com.duty.backend.mapper.DutyScheduleMapper;
import com.duty.backend.service.DutyScheduleService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class DutyScheduleServiceImpl extends ServiceImpl<DutyScheduleMapper, DutySchedule> implements DutyScheduleService {
    
    @Override
    public Result<?> getByUserId(Long userId) {
        List<DutySchedule> list = baseMapper.selectByUserId(userId);
        // 过滤掉已结束的值班记录（结束时间早于当前时间）
        LocalDateTime now = LocalDateTime.now();
        List<DutySchedule> filtered = list.stream().filter(item -> {
            if (item.getDutyDate() == null || item.getEndTime() == null) {
                return false;
            }
            LocalDateTime endTime = LocalDateTime.of(item.getDutyDate(), item.getEndTime());
            return !endTime.isBefore(now);
        }).toList();
        return Result.success(filtered);
    }
    
    @Override
    public Result<?> getHistoryByUserId(Long userId) {
        List<DutySchedule> list = baseMapper.selectAllByUserId(userId);
        // 只返回已结束的值班记录（结束时间早于当前时间）
        LocalDateTime now = LocalDateTime.now();
        List<DutySchedule> filtered = list.stream().filter(item -> {
            if (item.getDutyDate() == null || item.getEndTime() == null) {
                return false;
            }
            LocalDateTime endTime = LocalDateTime.of(item.getDutyDate(), item.getEndTime());
            return endTime.isBefore(now);
        }).toList();
        return Result.success(filtered);
    }
    
    @Override
    public Result<?> getByCollegeId(Long collegeId) {
        List<DutySchedule> list = baseMapper.selectByCollegeId(collegeId);
        return Result.success(list);
    }
    
    @Override
    public Result<?> getByDate(String date) {
        List<DutySchedule> list = baseMapper.selectByDate(date);
        return Result.success(list);
    }
    
    @Override
    public Result<?> getAll() {
        LambdaQueryWrapper<DutySchedule> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DutySchedule::getDeleted, 0);
        wrapper.orderByAsc(DutySchedule::getDutyDate, DutySchedule::getStartTime);
        return Result.success(this.list(wrapper));
    }
    
    @Override
    public Result<?> add(DutyScheduleDTO dto) {
        DutySchedule schedule = new DutySchedule();
        BeanUtils.copyProperties(dto, schedule);
        schedule.setStatus(1);
        schedule.setDeleted(0);
        this.save(schedule);
        return Result.success("添加成功", schedule);
    }
    
    @Override
    public Result<?> update(DutyScheduleDTO dto) {
        DutySchedule schedule = this.getById(dto.getId());
        if (schedule == null) {
            return Result.error("值班安排不存在");
        }
        BeanUtils.copyProperties(dto, schedule);
        this.updateById(schedule);
        return Result.success("更新成功", schedule);
    }
    
    @Override
    public Result<?> delete(Long id) {
        DutySchedule schedule = this.getById(id);
        if (schedule == null) {
            return Result.error("值班安排不存在");
        }
        this.removeById(id);
        return Result.success("删除成功");
    }
    
    @Override
    public Result<?> batchImport(List<DutyScheduleDTO> list) {
        for (DutyScheduleDTO dto : list) {
            DutySchedule schedule = new DutySchedule();
            BeanUtils.copyProperties(dto, schedule);
            schedule.setStatus(1);
            schedule.setDeleted(0);
            this.save(schedule);
        }
        return Result.success("导入成功");
    }
    
    @Override
    public Result<?> search(String keyword, Long userId) {
        LambdaQueryWrapper<DutySchedule> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DutySchedule::getDeleted, 0);
        if (userId != null) {
            wrapper.ne(DutySchedule::getUserId, userId);
        }
        wrapper.and(w -> w.like(DutySchedule::getLocation, keyword)
                .or().like(DutySchedule::getRemark, keyword));
        wrapper.orderByAsc(DutySchedule::getDutyDate, DutySchedule::getStartTime);
        return Result.success(this.list(wrapper));
    }
}