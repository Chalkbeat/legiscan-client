import { LegiscanClient } from "../client.js";
import { stringify } from "csv";
import * as fs from "node:fs/promises";

const BATCH_SIZE = 20;

var client = new LegiscanClient();

var handle = await fs.open("../outfile.csv", "w+");
var stream = handle.createWriteStream();
var exporter = stringify({});
exporter.pipe(stream);
exporter.write(["bill ID", "last action", "bill number","description", "link", "subjects", "sponsors", "supplements"]);

var all = await client.getMasterList({ state: "MI"});

for (var i = 0; i < all.length; i += BATCH_SIZE) {
  let slice = all.slice(i, i + BATCH_SIZE);
  let request = slice.map(async bill => {

    var details = await client.getBill(bill.bill_id);
    Object.assign(bill, details);

  });

  console.log(`Adding details for items ${i} through ${i + BATCH_SIZE}...`);
  await Promise.all(request);
  console.log(`Writing items...`);
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

exporter.end();