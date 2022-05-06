-- CREATE TABLE USER_ARGEE_COMMENT

CREATE TABLE user_agree_comment (
  `userId` varchar(64) NOT NULL COMMENT '用户标识',
  `commentId` varchar(64) NOT NULL COMMENT '评论标识',
  PRIMARY KEY (`userId`, `commentId`)
)