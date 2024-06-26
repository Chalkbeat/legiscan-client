/*
Sample code: multiquery merging

Getting all bills around a topic based on keywords may involve running
multiple queries. This code performs repeated searches for keywords in a
larger query, de-deduplicates them based on the Legiscan ID, and then outputs
the final result to a JSON file for processing.

*/

import { LegiscanClient } from "../client.js";
import * as fs from "node:fs";
import { PROGRESS_VALUES as STATUS } from "../enums.js";

var client = new LegiscanClient();

// search term that fills in flex words within base query 
var queries = [
  "gender",
  "transgender",
  "sexual orientation",
  "homosexual",
  "homosexuality",
  "parental rights",
  "gender identity",
  "gender transition"
]

var collected = new Map();
var hits = [];

for (var q of queries) {
  var query = `school AND "${q}" NOT "medical school"`;

  for await (var item of client.getSearchAsync(query, { state: "wa" })) {
    var { bill_id, relevance } = item;
    var details = await client.getBill(bill_id);
    Object.assign(item, details);
    // store the result for every hit
    hits.push({ bill_id, relevance, searchTerm: q });
    // store the item just once
    if (!collected.has(bill_id)) {
      collected.set(bill_id, item);
    }
  }
}

console.log(hits.length + " search results");
console.log(collected.size + " distinct bills associated with those results");

var acceptable = new Set([STATUS.Enrolled, STATUS.Passed]);
for (var [id, bill] of collected) {
  // removes bills that are not enrolled or passed
  // we got the details by default above, which includes status
  // sets an arbitrary relevance threshold to filter bills based on Legiscan's relevancy score
  if (!acceptable.has(bill.status_id) || bill.relevance < 70) {
    collected.delete(id);
    hits = hits.filter(b => b.bill_id != id);
  }
}

console.log(hits.length + " search results for passed bills");
console.log("Search queries that returned results: ", [...new Set(hits.map(h => h.searchTerm))])
console.log(collected.size + " distinct bills that have passed");

fs.writeFileSync('outfile.json', JSON.stringify(Object.fromEntries(collected), null, 2))