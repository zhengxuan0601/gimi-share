-- CREATE COMMENT TABLE

CREATE TABLE comment (
  `id` varchar(64) NOT NULL COMMENT '评论标识',
  `articleId` varchar(64) NULL COMMENT '评论所属文章',
  `replyId` varchar(64) NULL COMMENT '所在回复的评论标识',
  `userId` varchar(64) NOT NULL COMMENT '评论所属用户标识',
  `content` varchar(255) NOT NULL COMMENT '评论内容',
  `likeCounts` int NULL DEFAULT 0 COMMENT '被点赞次数',
  `createTime` varchar(64) NOT NULL COMMENT '评论时间',
  PRIMARY KEY (`id`)
)