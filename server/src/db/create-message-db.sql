-- CREATE TABLE MESSAGE

CREATE TABLE message (
  `id` varchar(64) NOT NULL,
  `sourceUserId` varchar(64) NOT NULL,
  `targetUserId` varchar(64) NOT NULL,
  `articleId` varchar(64) NULL,
  `circleId` varchar(64) NULL,
  `commentId` varchar(64) NULL,
  `comment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `itemType` enum('1', '2', '3', '4') NOT NULL COMMENT '消息类型 1 - 点赞， 2 - 收藏， 3 - 关注， 4 - 评论',
  `haveRead` enum('0', '1') NOT NULL DEFAULT '0' COMMENT '消息是否已读 0 - 未读， 1 - 已读',
  `isReplyComment` enum('0', '1') NULL COMMENT '是否为评论下的评论 0 -否， 1 - 是'
  `createTime` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
)