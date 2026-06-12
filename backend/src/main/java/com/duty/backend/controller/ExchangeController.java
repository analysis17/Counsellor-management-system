package com.duty.backend.controller;

import com.duty.backend.dto.ExchangeRequestDTO;
import com.duty.backend.dto.Result;
import com.duty.backend.service.ExchangeRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

@RestController
@RequestMapping("/api/exchange")
public class ExchangeController {
    
    @Autowired
    private ExchangeRequestService exchangeRequestService;
    
    @GetMapping("/pending/{userId}")
    public Result<?> getPendingRequests(@PathVariable Long userId) {
        return exchangeRequestService.getPendingRequests(userId);
    }
    
    @GetMapping("/accepted")
    public Result<?> getAcceptedRequests() {
        return exchangeRequestService.getAcceptedRequests();
    }
    
    @PostMapping("/apply")
    public Result<?> apply(@Valid @RequestBody ExchangeRequestDTO dto,
                          @RequestHeader("Authorization") String token) {
        Long fromUserId = getUserIdFromToken(token);
        return exchangeRequestService.apply(dto, fromUserId);
    }
    
    @PostMapping("/accept/{id}")
    public Result<?> accept(@PathVariable Long id,
                           @RequestHeader("Authorization") String token) {
        Long toUserId = getUserIdFromToken(token);
        return exchangeRequestService.accept(id, toUserId);
    }
    
    @PostMapping("/reject/{id}")
    public Result<?> reject(@PathVariable Long id,
                           @RequestHeader("Authorization") String token) {
        Long toUserId = getUserIdFromToken(token);
        return exchangeRequestService.reject(id, toUserId);
    }
    
    @PostMapping("/approve/{id}")
    public Result<?> approve(@PathVariable Long id) {
        return exchangeRequestService.approve(id);
    }
    
    @GetMapping("/history/{userId}")
    public Result<?> getHistory(@PathVariable Long userId) {
        return exchangeRequestService.getHistory(userId);
    }
    
    private Long getUserIdFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return 1L;
    }
}