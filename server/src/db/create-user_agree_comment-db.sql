-- CREATE TABLE USER_ARGEE_COMMENT

CREATE TABLE user_agree_comment (
  `userId` varchar(64) NOT NULL COMMENT '用户标识',
  `commentId` varchar(64) NOT NULL COMMENT '评论标识',
  `itemType` enum('1', '2', '3', '4') NOT NULL COMMENT '评论类别 1 - 文章下的评论， 2 - 自言下的评论' ,
  PRIMARY KEY (`userId`, `commentId`)
)