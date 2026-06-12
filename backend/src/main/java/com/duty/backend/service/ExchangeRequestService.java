package com.duty.backend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.duty.backend.dto.ExchangeRequestDTO;
import com.duty.backend.dto.Result;
import com.duty.backend.entity.ExchangeRequest;

public interface ExchangeRequestService extends IService<ExchangeRequest> {
    Result<?> getPendingRequests(Long userId);
    Result<?> getAcceptedRequests();
    Result<?> apply(ExchangeRequestDTO dto, Long fromUserId);
    Result<?> accept(Long id, Long toUserId);
    Result<?> reject(Long id, Long toUserId);
    Result<?> approve(Long id);
    Result<?> getHistory(Long userId);
}