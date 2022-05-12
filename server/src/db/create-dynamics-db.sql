-- CREATE TABLE DYNAMICS

CREATE TABLE dynamics (
  `id` varchar(64) NOT NULL,
  `userId` varchar(64) NOT NULL,
  `type` enum('1', '2', '3', '4') NOT NULL COMMENT '动态类型 1 - 发布， 2 - 点赞， 3 - 关注， 4 - 收藏',
  `articleId` varchar(64) NULL,
  `circleId` varchar(64) NULL,
  `focusUserId` varchar(64) NULL,
  `createTime` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
)