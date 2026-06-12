package com.duty.backend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.duty.backend.dto.DutyScheduleDTO;
import com.duty.backend.dto.Result;
import com.duty.backend.entity.DutySchedule;
import java.util.List;

public interface DutyScheduleService extends IService<DutySchedule> {
    Result<?> getByUserId(Long userId);
    Result<?> getHistoryByUserId(Long userId);
    Result<?> getByCollegeId(Long collegeId);
    Result<?> getByDate(String date);
    Result<?> getAll();
    Result<?> add(DutyScheduleDTO dto);
    Result<?> update(DutyScheduleDTO dto);
    Result<?> delete(Long id);
    Result<?> batchImport(List<DutyScheduleDTO> list);
    Result<?> search(String keyword, Long userId);
}