-- CREATE COMMENT TABLE

CREATE TABLE comment (
  `id` varchar(64) NOT NULL COMMENT '评论标识',
  `articleId` varchar(64) NULL COMMENT '评论所属文章',
  `replyId` varchar(64) NULL COMMENT '所在回复的评论标识',
  `replyComment` varchar(255) NULL COMMENT '所在回复的评论内容',
  `topId` varchar(64) NULL COMMENT '当前评论属于最顶级评论标识',
  `replyNickname` varchar(64) NULL COMMENT '回复的评论作者昵称',
  `replyUserId` varchar(64) NULL COMMENT '回复的评论作者标识',
  `userId` varchar(64) NOT NULL COMMENT '评论所属用户标识',
  `content` varchar(255) NOT NULL COMMENT '评论内容',
  `likeCounts` int NULL DEFAULT 0 COMMENT '被点赞次数',
  `createTime` varchar(64) NOT NULL COMMENT '评论时间',
  PRIMARY KEY (`id`)
)