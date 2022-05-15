-- CREATE TABLE BROWSE_HISTORY TABLE

CREATE TABLE browse_history (
  `id` varchar(64) NOT NULL,
  `userId` varchar(64) NOT NULL,
  `uid` varchar(64) NOT NULL,
  `articleId` varchar(64) NOT NULL,
  `createTime` varchar(64) NOT NULL,
  `date` varchar(16) NOT NULL,
  PRIMARY KEY (`id`)
)