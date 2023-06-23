var csv = require("csv");
var fs = require("fs").promises;

var stringify = function(data, options = { header: true }) {
  return new Promise((ok, fail) => csv.stringify(data, options, (err, result) => err ? fail(err) : ok(result)));
}

var writeCSV = async function(file, data) {
  // make sure the output directory exists
  await fs.mkdir("./output", { recursive: true });
  var contents = await stringify(data);
  await fs.writeFile(`./output/${file}`, contents);
  console.log(`Wrote ${data.length} rows to ./output/${file}`);
}

module.exports = { writeCSV }