var { google } = require("googleapis");
var { getClient } = require("@nprapps/google-login");
var sheets = google.sheets("v4");

var valueInputOption = "raw";

var uploadSheet = async function (spreadsheetId, sheet, data) {
  var auth = await getClient();
  // clear the sheet, if it exists
  try {
    await sheets.spreadsheets.values.clear({
      auth,
      spreadsheetId,
      range: sheet + "!A:ZZ",
    });
  } catch (err) {
    console.log(err.errors.map((e) => e.message));
  }
  // replace it with the new data
  var header = Object.keys(data[0]);
  var values = [header];
  for (var record of data) {
    var row = header.map((h) => record[h]);
    values.push(row);
  }
  await sheets.spreadsheets.values.update({
    auth,
    spreadsheetId,
    range: sheet + "!A1",
    valueInputOption,
    resource: { values },
  });
  console.log(`Uploaded ${data.length} rows to ${spreadsheetId}/${sheet}`);
};

module.exports = { uploadSheet };