const cron = require("node-cron");

const scheduleDatabaseUpdate = (setTime, callback) => {
  cron.schedule(
    setTime,
    () => {
      callback();
    },
    {
      scheduled: true,
      timezone: "Asia/Bangkok",
    }
  );

  console.log("Cron job for database update has been scheduled.");
};

module.exports = { scheduleDatabaseUpdate };
