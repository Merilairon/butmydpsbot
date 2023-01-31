const unirest = require("unirest");
const mongoose  = require("mongoose");
const Logs = mongoose.model("Logs");
const {encounterIds} = require("../guild-wars-data");

module.exports = {
  extractDataFromLog: async (logLink) => {
    try {
      const id = logLink.replace("https://dps.report", "");
      const json = await unirest
        .post(`https://dps.report/getJSON?permalink=${id}`)
        .headers({
          Accept: "application/json",
        })
        .then((e) => {
          const { body } = e;
          return body;
        });
      if (!json) throw new Error("Was not able to gather log");
      const log = new Logs({
        date: createDateFromString(logLink),
        encounterId: json.triggerID,
        encounterType: encounterIds[json.triggerID].type,
        name: encounterIds[json.triggerID].name,
        players: json.players.map((p) => p.account),
        duration: json.duration,
        link: logLink,
        success: json.success,
      });
      log.save();
      return log;
    } catch (error) {
      throw new Error(`Was unable to save the log url to the database. ${error.stack}`);
    }
  }
};

function createDateFromString(logLink) {
  const minSplitArray = logLink.split("-");
  minSplitArray[2] = minSplitArray[2].split("_")[0];
  const date = {
    year: minSplitArray[1].substring(0, 4),
    month: minSplitArray[1].substring(4, 6),
    day: minSplitArray[1].substring(6, 8),
    hour: minSplitArray[2].substring(0, 2),
    minutes: minSplitArray[2].substring(2, 4),
    seconds: minSplitArray[2].substring(4, 6),
  };

  const { year, month, day, hour, minutes, seconds } = date;

  return new Date(`${year}-${month}-${day}T${hour}:${minutes}:${seconds}`);
}
