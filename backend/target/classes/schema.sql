-- 辅导员值班管理系统数据库初始化脚本

CREATE DATABASE IF NOT EXISTS duty_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE duty_system;

-- 学院表
CREATE TABLE IF NOT EXISTS sys_college (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    name VARCHAR(100) NOT NULL COMMENT '学院名称',
    code VARCHAR(50) COMMENT '学院代码',
    deleted INT DEFAULT 0 COMMENT '是否删除 0-否 1-是',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学院表';

-- 用户表
CREATE TABLE IF NOT EXISTS sys_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(100) NOT NULL COMMENT '密码',
    name VARCHAR(50) NOT NULL COMMENT '姓名',
    phone VARCHAR(20) COMMENT '手机号',
    college_id BIGINT COMMENT '学院ID',
    role VARCHAR(20) NOT NULL COMMENT '角色 COUNSELOR-辅导员 COLLEGE-学院 ADMIN-管理员',
    deleted INT DEFAULT 0 COMMENT '是否删除 0-否 1-是',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 值班安排表
CREATE TABLE IF NOT EXISTS duty_schedule (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '辅导员ID',
    college_id BIGINT NOT NULL COMMENT '学院ID',
    duty_date DATE NOT NULL COMMENT '值班日期',
    start_time TIME NOT NULL COMMENT '开始时间',
    end_time TIME NOT NULL COMMENT '结束时间',
    location VARCHAR(100) COMMENT '值班地点',
    remark VARCHAR(500) COMMENT '备注',
    status INT DEFAULT 1 COMMENT '状态 1-正常 0-取消',
    deleted INT DEFAULT 0 COMMENT '是否删除 0-否 1-是',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='值班安排表';

-- 换班申请表
CREATE TABLE IF NOT EXISTS exchange_request (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    from_user_id BIGINT NOT NULL COMMENT '申请人ID',
    to_user_id BIGINT NOT NULL COMMENT '被申请人ID',
    from_schedule_id BIGINT NOT NULL COMMENT '申请人值班安排ID',
    to_schedule_id BIGINT NOT NULL COMMENT '被申请人值班安排ID',
    reason VARCHAR(500) COMMENT '换班原因',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态 PENDING-待处理 ACCEPTED-已同意 REJECTED-已拒绝 APPROVED-已批准 COMPLETED-已完成',
    is_cross_college INT DEFAULT 0 COMMENT '是否跨学院 0-否 1-是',
    deleted INT DEFAULT 0 COMMENT '是否删除 0-否 1-是',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='换班申请表';

-- 初始化学院数据
INSERT INTO sys_college (name, code) VALUES 
('计算机学院', 'CS'),
('机械学院', 'ME'),
('电子学院', 'EE'),
('经济学院', 'EC');

-- 初始化管理员账号
INSERT INTO sys_user (username, password, name, role) VALUES 
('admin', '123456', '系统管理员', 'ADMIN');

-- 初始化辅导员账号
INSERT INTO sys_user (username, password, name, college_id, role) VALUES 
('counselor1', '123456', '张三', 1, 'COUNSELOR'),
('counselor2', '123456', '李四', 1, 'COUNSELOR'),
('counselor3', '123456', '王五', 2, 'COUNSELOR'),
('counselor4', '123456', '赵六', 2, 'COUNSELOR');

-- 初始化学院管理员账号
INSERT INTO sys_user (username, password, name, college_id, role) VALUES 
('college1', '123456', '计算机学院管理员', 1, 'COLLEGE'),
('college2', '123456', '机械学院管理员', 2, 'COLLEGE');

-- 初始化值班安排数据
INSERT INTO duty_schedule (user_id, college_id, duty_date, start_time, end_time, location) VALUES 
(1, 1, '2024-01-15', '08:00:00', '12:00:00', '学生服务中心101'),
(2, 1, '2024-01-15', '14:00:00', '18:00:00', '学生服务中心101'),
(3, 2, '2024-01-16', '08:00:00', '12:00:00', '学生服务中心102'),
(4, 2, '2024-01-16', '14:00:00', '18:00:00', '学生服务中心102');