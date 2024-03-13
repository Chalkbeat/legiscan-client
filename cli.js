import minimist from "minimist";
import { LegiscanClient } from "./client.js";

var client = new LegiscanClient();
var args = minimist(process.argv);

var query = args._.at(-1);

var results = await client.getSearch(query, !args.nodetails, args.state, args.year);

if (args.status) {
  var acceptable = new Set(args.status.split(",").map(Number));
  results = results.filter(r => acceptable.has(r.status));
}

// node cli 'schools and "transportation network" NOT medical' --status=3,4
console.log(JSON.stringify(results, null, 2));