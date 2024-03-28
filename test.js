import { LegiscanClient } from "./client.js";
import * as fs from "node:fs";

var { ENROLLED, PASSED } = LegiscanClient;

var client = new LegiscanClient();

// search term that fills in flex words within base query 
var queries = [
  // "gender",
  // "transgender",
  // "sexual orientation",
  // "homosexual",
  // "homosexuality",
  // "parental rights",
  // "gender identity",
  // "gender transition"
  "transportation network"
]

var collected = new Map();
var hits = [];

for (var q of queries) {
  // var query = `school AND ${q} NOT "medical school"`;
  var query = `school AND "${q}"`;

  // add `, "wa"` to pick a state
  // var all = await client.getSearch(query, true, "wa");
  for await (var item of client.getSearch(query, true, "wa")) {
    var { bill_id, relevance } = item;
    // store the result for every hit
    hits.push({ bill_id, relevance, searchTerm: q });
    // store the item just once
    if (!collected.has(bill_id)) {
      collected.set(bill_id, item);
    }
  }
}

console.log(hits.length + " search results");
console.log(collected.size + " bills associated with those results");

for (var [id, bill] of collected) {
  // removes bills that are not enrolled or passed
  // we got the details by default above, which includes status
  var acceptable = new Set([ENROLLED, PASSED]);
  if (!acceptable.has(bill.status)) {
    collected.delete(id);
    hits = hits.filter(b => b.bill_id != id);
    continue;
  }
}

console.log(hits.length + " search results for passed bills");
console.log(collected.size + " bills that have passed");

// console.log(JSON.stringify(Object.fromEntries(collected), null, 2));