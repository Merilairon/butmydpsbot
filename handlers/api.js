const createError = require("http-errors");
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

const { createLog } = require("./createlog");
const { extractDataFromLog } = require("./extractdatafromlog");
const logger = require("../modules/logger.js");
var pjson = require("../package.json");

const port = process.env.API_PORT;

logger.log("Starting API: 👌", "log");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/logs/",
  })
);

app.get("/", (req, res) => res.json({ version: pjson.version }));

app.post("/file", async (req, res, next) => {
  try {
    const {
      files: { file },
    } = req;
    await file.mv("/tmp/logs/" + file.name);
    res.json(await extractDataFromLog((await createLog("/tmp/logs/" + file.name)).permalink));
  } catch (e) {
    console.error(e);
    return res.json({ errors: [{ message: "Error gathering data from log" }] });
  }
});

app.post("/uploadContent", async (req, res, next) => {
  try {
    const {
      files: { file },
    } = req;
    await file.mv("/tmp/logs/" + file.name);
    const json = await createLog("/tmp/logs/" + file.name);
    await extractDataFromLog(json.permalink);
    res.json(json);
  } catch (e) {
    console.error(e);
    return res.json({ errors: [{ message: "Error gathering data from log" }] });
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  return res.json({ errors: [{ message: "An error has occured or the endpoint doesn't exist" }] });
});

app.listen(port, () => {

  logger.log(`But My DPS API is online with endpoint http://localhost:${port}`, "log");
});
