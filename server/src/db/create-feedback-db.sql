-- CREATE TABLE FEEDBACK

CREATE TABLE feedback (
  `id` varchar(64) NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '文章markdown字符内容',
  `userId` varchar(64) NOT NULL,
  `createTime` varchar(64) NOT NULL,
  `likeCount` int NULL DEFAULT 0 COMMENT '被点赞次数',
  `dislikeCount` int NULL DEFAULT 0 COMMENT '被踩次数',
  `giftCount` int NULL DEFAULT 0 COMMENT '被送礼物次数',
  `heartCount` int NULL DEFAULT 0 COMMENT '被比心次数',
  `rocketCount` int NULL DEFAULT 0 COMMENT '被送火箭次数',
  `viewCount` int NULL DEFAULT 0 COMMENT '被浏览次数',
  PRIMARY KEY (`id`)
)