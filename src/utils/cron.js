const cron = require("node-cron");
const { autoUpdate } = require("./auto-update");

const scheduleDatabaseUpdate = () => {
  cron.schedule(
    "0 * * * *",
    () => {
      autoUpdate();
    },
    {
      scheduled: true,
      timezone: "Asia/Bangkok",
    }
  );

  console.log("Cron job for database update has been scheduled.");
};

module.exports = { scheduleDatabaseUpdate };
