-- CREATE TABLE SHARECIRCLE_COMMENT

CREATE TABLE sharecircle_comment (
  `id` varchar(64) NOT NULL,
  `circleId` varchar(64) NOT NULL,
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `replyId` varchar(64) NULL,
  `replyComment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `topId` varchar(64) NULL,
  `replyNickname` varchar(64) NULL,
  `replyUserId` varchar(64) NULL,
  `userId` varchar(64) NOT NULL,
  `createTime` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
)