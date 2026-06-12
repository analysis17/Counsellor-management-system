package com.duty.backend.controller;

import com.duty.backend.dto.DutyScheduleDTO;
import com.duty.backend.dto.Result;
import com.duty.backend.service.DutyScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/duty")
public class DutyScheduleController {
    
    @Autowired
    private DutyScheduleService dutyScheduleService;
    
    @GetMapping("/user/{userId}")
    public Result<?> getByUserId(@PathVariable Long userId) {
        return dutyScheduleService.getByUserId(userId);
    }
    
    @GetMapping("/history/{userId}")
    public Result<?> getHistoryByUserId(@PathVariable Long userId) {
        return dutyScheduleService.getHistoryByUserId(userId);
    }
    
    @GetMapping("/college/{collegeId}")
    public Result<?> getByCollegeId(@PathVariable Long collegeId) {
        return dutyScheduleService.getByCollegeId(collegeId);
    }
    
    @GetMapping("/date/{date}")
    public Result<?> getByDate(@PathVariable String date) {
        return dutyScheduleService.getByDate(date);
    }
    
    @GetMapping("/all")
    public Result<?> getAll() {
        return dutyScheduleService.getAll();
    }
    
    @PostMapping("/add")
    public Result<?> add(@Valid @RequestBody DutyScheduleDTO dto) {
        return dutyScheduleService.add(dto);
    }
    
    @PutMapping("/update")
    public Result<?> update(@Valid @RequestBody DutyScheduleDTO dto) {
        return dutyScheduleService.update(dto);
    }
    
    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        return dutyScheduleService.delete(id);
    }
    
    @PostMapping("/import")
    public Result<?> batchImport(@RequestBody List<DutyScheduleDTO> list) {
        return dutyScheduleService.batchImport(list);
    }
    
    @GetMapping("/search")
    public Result<?> search(@RequestParam String keyword, 
                           @RequestParam(required = false) Long userId) {
        return dutyScheduleService.search(keyword, userId);
    }
}