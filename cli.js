#!/usr/bin/env node

import minimist from "minimist";
import { LegiscanClient } from "./client.js";

var client = new LegiscanClient();
var args = minimist(process.argv);

var [node, _, method, ...positional] = args._;

function stringify(obj) {
  console.log(JSON.stringify(obj));
}

var client = new LegiscanClient();

switch (method.toLowerCase()) {
  case "getsearch":
    var [query] = positional;
    for await (var result of client.getSearchAsync(query, args)) {
      stringify(result);
    }
  break;

  case "getbill":
    var id = args.id || positional[0];
    stringify(await client.getBill(id));
  break;

  case "getbilltext":
    var id = args.id || positional[0];
    stringify(await client.getBillText(id));
  break;

  case "getmasterlist":
    for (var result of await client.getMasterList(args)) {
      stringify(result);
    }
  break;

  default:
    console.log("That command is not implemented yet. We welcome contributions at https://github.com/chalkbeat/legiscan-client");
}