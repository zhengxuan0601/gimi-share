-- CREATE TABLE FEEDBACK_ATTITUDE

CREATE TABLE feedback_attitude (
  `userId` varchar(64) NOT NULL,
  `feedbackId` varchar(64) NOT NULL,
  `itemType` enum('1', '2', '3', '4', '5', '6') NOT NULL COMMENT '对反馈信息的观点', 
  PRIMARY KEY (`userId`, `feedbackId`, `itemType`)
)
-- 1 - 👍， 2 - 👎， 3 - 🎉， 4 - ❤️， 5 - 🚀， 6 - 👀