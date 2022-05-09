-- CREATE TABLE SHARE_CIRCLE

CREATE TABLE share_circle (
  `id` varchar(64) NOT NULL,
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `picList` varchar(512) NULL DEFAULT '',
  `userId` varchar(64) NOT NULL,
  `createTime` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
)