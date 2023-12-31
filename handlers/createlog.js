const unirest = require("unirest");

module.exports = {
  createLog: async (fileURL) => {

    const logJson = await unirest
      .post("https://dps.report/uploadContent")
      .headers({
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      })
      .field("json", 1)
      .attach("file", fileURL)
      .then((e) => {
        const {
          body
        } = e;

        return body;
      });
    if (!logJson) throw new Error("Was not able to upload log");
    return logJson;
  }
};