#!/usr/bin/env node

import minimist from "minimist";
import { LegiscanClient } from "./client.js";

var client = new LegiscanClient();
var args = minimist(process.argv);

var [node, _, method, ...positional] = args._;
// a lot of methods just use the ID parameter
var id = args.id || positional[0];

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
    stringify(await client.getBill(id));
  break;

  case "getbilltext":
    stringify(await client.getBillText(id));
  break;

  case "getamendment":
    stringify(await client.getAmendment(id));
  break;

  case "getsupplement":
    stringify(await client.getSupplement(id));
  break;

  case "getsessionlist":
    var state = args.state || positional[0];
    var list = await client.getSessionList(state);
    for (var session of list) {
      stringify(session);
    }
  break;

  case "getrollcall":
    stringify(await client.getRollCall(id));
  break;

  case "getperson":
    stringify(await client.getPerson(id));
  break;

  case "getsessionpeople":
    for (var result of await client.getSessionPeople(id)) {
      stringify(result);
    }
  break;

  case "getsponsoredlist":
    for (var result of await client.getSponsoredList(id)) {
      stringify(result);
    }
  break;

  case "getmasterlist":
    for (var result of await client.getMasterList(args)) {
      stringify(result);
    }
  break;

  default:
    console.log("That command is not implemented yet. We welcome contributions at https://github.com/chalkbeat/legiscan-workflow");
}