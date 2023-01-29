const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const { createLog } = require("../handlers/createlog");
const { extractDataFromLog } = require("../handlers/extractdatafromlog");

const port = process.env.API_PORT;

try {
  const stringlength2 = 69;
  console.log("\n")
  console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.yellow)
  console.log(`     ┃ `.bold.yellow + " ".repeat(-1 + stringlength2 - ` ┃ `.length) + "┃".bold.yellow)
  console.log(`     ┃ `.bold.yellow + `Starting But My DPS API...`.bold.yellow + " ".repeat(-1 + stringlength2 - ` ┃ `.length - `Starting But My DPS API...`.length) + "┃".bold.yellow)
  console.log(`     ┃ `.bold.yellow + " ".repeat(-1 + stringlength2 - ` ┃ `.length) + "┃".bold.yellow)
  console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.yellow)
} catch { /* */ }

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/logs/",
  })
);

app.get("/", (req, res) => res.json({ version: "1.0.0" }));

app.post("/file", async (req, res, next) => {
  try {
    const {
      files: { file },
    } = req;
    await file.mv("/tmp/logs/" + file.name);
    res.json(await extractDataFromLog((await createLog("/tmp/logs/" + file.name)).permalink))
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
    let json = await createLog("/tmp/logs/" + file.name);
    await extractDataFromLog(json.permalink);
    res.json(json);
  } catch (e) {
    console.error(e);
    return res.json({ errors: [{ message: "Error gathering data from log" }] });
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  return res.json({ errors: [{ message: "An error has occured or the endpoint doesn't exist" }] });
});

app.listen(port, () => {

  try {
    const stringlength = 69;
    console.log("\n")
    console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightGreen)
    console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
    console.log(`     ┃ `.bold.brightGreen + `But My DPS API is online with endpoint http://localhost:${port}`.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - `But My DPS API is online with endpoint http://localhost:${port}`.length) + "┃".bold.brightGreen)
    console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
    console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightGreen)
  } catch { /* */ }
});
