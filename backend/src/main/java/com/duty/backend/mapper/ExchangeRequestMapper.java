package com.duty.backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.duty.backend.entity.ExchangeRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface ExchangeRequestMapper extends BaseMapper<ExchangeRequest> {
    
    @Select("SELECT er.*, " +
            "u1.name as from_user_name, u2.name as to_user_name " +
            "FROM exchange_request er " +
            "LEFT JOIN sys_user u1 ON er.from_user_id = u1.id " +
            "LEFT JOIN sys_user u2 ON er.to_user_id = u2.id " +
            "WHERE er.deleted = 0 AND er.to_user_id = #{userId} AND er.status = 'PENDING'")
    List<ExchangeRequest> selectPendingByToUserId(Long userId);
    
    @Select("SELECT er.*, " +
            "u1.name as from_user_name, u2.name as to_user_name " +
            "FROM exchange_request er " +
            "LEFT JOIN sys_user u1 ON er.from_user_id = u1.id " +
            "LEFT JOIN sys_user u2 ON er.to_user_id = u2.id " +
            "WHERE er.deleted = 0 AND er.status = 'ACCEPTED'")
    List<ExchangeRequest> selectAcceptedRequests();
}