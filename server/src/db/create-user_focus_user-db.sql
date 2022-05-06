-- CREATE TABLE USER-FOCUS-USER

CREATE TABLE user_focus_user (
  `userId` varchar(64) NOT NULL COMMENT '关注者id',
  `focusId` varchar(64) NOT NULL COMMENT '被关注者id',
  PRIMARY KEY (`userId`, `focusId`)
)