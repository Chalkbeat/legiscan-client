import minimist from "minimist";
import { LegiscanClient } from "./client.js";

var client = new LegiscanClient();
var args = minimist(process.argv);
var statusSet = args.status ? new Set(args.status.split(",").map(Number)) : { has: () => true };

var query = args._.at(-1);

var params = {
  state: args.state,
  year: args.year
};

// async collection
// var all = await client.getSearch(query, !args.nodetails, params);
// console.log(all.length);

// async iterator
for await (var result of client.getSearchAsync(query, !args.nodetails, params)) {
  if (statusSet.has(result.status)) {
    // produce results as ND-JSON
    console.log(JSON.stringify(result));
  }
}

// node cli 'schools and "transportation network" NOT medical' --status=3,4