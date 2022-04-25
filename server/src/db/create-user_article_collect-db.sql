-- CREATE USER_ARTICLE_COLLECT TABLE

CREATE TABLE user_article_collect (
  `userId` varchar(64) NOT NULL COMMENT '用户标识',
  `articleId` varchar(64) NOT NULL COMMENT '文章标识',
  PRIMARY KEY (`userId`, `articleId`)
)