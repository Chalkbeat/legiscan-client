/*
Sample code: list all current Michigan legislation for reporters

Uses SQLite as a key/value store to cache bill details based on their change
hash, so that the ~3K records don't eat an entire month's worth of API calls
in the first week.

*/

import { LegiscanClient } from "../client.js";
import { stringify } from "csv";
import * as fs from "node:fs/promises";
import Database from "better-sqlite3";
import progress from "cli-progress";

var cache = new Database("cache.db");
var created = cache.exec(`CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, value TEXT);`);
var getCached = cache.prepare(`SELECT value FROM cache WHERE key = ?;`).pluck();
var setCached = cache.prepare(`INSERT INTO cache VALUES (?, ?);`);

const BATCH_SIZE = 20;

var client = new LegiscanClient();

var handle = await fs.open("../outfile.csv", "w+");
var stream = handle.createWriteStream();
var exporter = stringify({});
exporter.pipe(stream);
exporter.write(["bill ID", "last action", "bill number","description", "link", "subjects", "sponsors", "supplements"]);

console.log("Getting master list from Legiscan...");
var all = await client.getMasterList({ state: "MI"});

var cachedCount = 0;
var bar = new progress.SingleBar({
  format: "{bar} | Retrieved: {value}/{total} ({percentage}%) | Cached: {cachedCount}/{total}"
}, progress.Presets.rect);
console.log("Retrieving details for each bill...");
bar.start(all.length, 0, { cachedCount });

for (var i = 0; i < all.length; i += BATCH_SIZE) {
  let slice = all.slice(i, i + BATCH_SIZE);
  let request = slice.map(async bill => {
    var hash = bill.change_hash;

    var details = getCached.get(hash);
    if (details) {
      // use the cached info
      cachedCount++;
      details = JSON.parse(details);
    } else {
      // get a fresh copy and cache it
      details = await client.getBill(bill.bill_id);
      setCached.run(hash, JSON.stringify(details));
    }
    Object.assign(bill, details);
    bar.increment(1, { cachedCount });

  });

  await Promise.all(request);
  for (var bill of slice) {
    exporter.write([
      bill.bill_id,
      bill.last_action_date,
      bill.bill_number,
      bill.description,
      bill.state_link,
      bill.subjects.map(s => s.subject_name).join(", "),
      bill.sponsors.map(s => s.name).join(", "),
      bill.supplements.some(b => b.type_id == 3 || 2)
    ]);
  }
};

bar.stop();

exporter.end();