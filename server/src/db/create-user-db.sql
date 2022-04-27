-- CREATE USER TABLE

CREATE TABLE user (
  `id` varchar(24) NOT NULL COMMENT '用户编码',
  `username` varchar(16) NOT NULL COMMENT '用户登录账号',
  `password` varchar(255) NOT NULL COMMENT '用户密码',
  `nickname` varchar(32) NULL COMMENT '用户昵称',
  `gender` enum('0','1') NULL COMMENT '用户性别 0 男 1 女',
  `avatar` varchar(255) NULL COMMENT '头像',
  `email` varchar(32) NULL COMMENT '邮箱',
  `tel` varchar(16) NULL COMMENT '手机号',
  `age` int NULL COMMENT '年龄',
  `job` varchar(50) NULL COMMENT '职位',
  `createTime` varchar(50) NOT NULL COMMENT '创建时间',
  `updateTime` varchar(50) NULL COMMENT '更新时间',
  `description` varchar(255) NULL COMMENT '简介',
  PRIMARY KEY (`id`)
);