-- CREATE TABLE FEEDBACK

CREATE TABLE feedback (
  `id` varchar(64) NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '文章markdown字符内容',
  `userId` varchar(64) NOT NULL,
  `createTime` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
)