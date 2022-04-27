-- CREATE ARTICLE TABLE

CREATE TABLE article (
  `id` varchar(24) NOT NULL COMMENT '文章标识',
  `userId` varchar(24) NOT NULL COMMENT '文章所属用户标识',
  `articleTitle` varchar(64) NOT NULL COMMENT '文章标题',
  `content` longtext NOT NULL COMMENT '文章markdown字符内容',
  `category` varchar(16) NOT NULL COMMENT '文章所属分类',
  `tag` varchar(255) NOT NULL COMMENT '文章标签',
  `coverImage` varchar(255) NULL COMMENT '文章封面utl',
  `description` varchar(255) NOT NULL COMMENT '文章描述信息',
  `linkUrl` varchar(255) NULL COMMENT '参考文章链接',
  `createTime` varchar(24) NOT NULL COMMENT '文章创建时间',
  `updateTime` varchar(24) NULL COMMENT '文章更新时间',
  `viewCounts` int NULL DEFAULT 0 COMMENT '文章浏览器次数',
  `collectCounts` int NULL DEFAULT 0 COMMENT '文章被收藏次数',
  `likeCounts` int NULL DEFAULT 0 COMMENT '文章被点赞次数',
  `commentCounts` int NULL DEFAULT 0 COMMENT '文章被评论次数',
  PRIMARY KEY (`id`)
)