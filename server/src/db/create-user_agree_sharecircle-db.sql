-- CREATE TABLE USER_AGREE_SHARECIRCLE

CREATE TABLE user_agree_sharecircle(
  `userId` varchar(64) NOT NULL,
  `circleId` varchar(64) NOT NULL,
  PRIMARY KEY (`userId`, `circleId`)
)