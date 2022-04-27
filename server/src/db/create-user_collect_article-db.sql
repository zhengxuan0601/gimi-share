-- CREATE USER_COLLECT_ARTICLE TABLE

CREATE TABLE user_collect_article (
  `userId` varchar(64) NOT NULL COMMENT '用户标识',
  `articleId` varchar(64) NOT NULL COMMENT '文章标识',
  PRIMARY KEY (`userId`, `articleId`)
)