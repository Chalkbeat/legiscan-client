#!/usr/bin/env node

import minimist from "minimist";
import { LegiscanClient } from "./client.js";

var client = new LegiscanClient();
var args = minimist(process.argv);

var [node, _, method, ...positional] = args._;
// a lot of methods just use the ID parameter
var first = args.id || positional[0];

function stringify(obj) {
  if (obj instanceof Array) {
    for (var item of obj) {
      console.log(JSON.stringify(item));
    }
  } else {
    console.log(JSON.stringify(obj));
  }
}

// each command and its metadata is defined here
// some are manually defined
var commands = {
  // search is special-cased for both positional and optional arguments
  getsearch: {
    async run() {
      var [query] = positional;
      for await (var result of client.getSearchAsync(query, args)) {
        stringify(result);
      }
    },
    command: "getSearch",
    description: "Search the Legiscan DB using a text query",
    params: "QUERY [--state=POSTAL_CODE] [--year=LEGISCAN_YEAR_VALUE]"
  },
  // getmasterlist has mutually exclusive optional arguments
  getmasterlist: {
    async run() {
      for (var result of await client.getMasterList(args)) {
        stringify(result);
      }
    },
    command: "getMasterList",
    params: "[--state=POSTAL_CODE] [--id=SESSION_ID]",
    description: "Get all bills for a given state or session (at least one must be provided)"
  }
}

// most commands follow the same inputs and structure
// so we'll use this as a macro to generate them
function defineSimpleCommand(command, description, params = "ID") {
  commands[command.toLowerCase()] = {
    async run() {
      var result = await client[command](first);
      stringify(result);
    },
    command,
    description,
    params
  }
}

defineSimpleCommand("getBill", "Get detailed bill information", "BILL_ID");
defineSimpleCommand("getBillText", "Get the text of a specific bill version", "DOCUMENT_ID");
defineSimpleCommand("getAmendment", "Get the text of an amendment", "DOCUMENT_ID");
defineSimpleCommand("getSupplement", "Get the text of a supplemental document", "DOCUMENT_ID");
defineSimpleCommand("getRollCall", "Get a roll call vote result for a bill", "BILL_ID");
defineSimpleCommand("getPerson", "Get the detailed profile for a person", "PERSON_ID");
defineSimpleCommand("getSessionPeople", "Get all people involved in a given session", "SESSION_ID");
defineSimpleCommand("getSponsoredList", "Get all sponsors for a bill", "BILL_ID");
defineSimpleCommand("getSessionList", "Get sessions for a single state, or for all states", "[STATE]")

// get the selected command from the dictionary and execute it
var requested = commands[method];
if (!requested) {
  // show help for a specific command
  if (first && first.toLowerCase() in commands) {
    // specific command help
    var def = commands[first.toLowerCase()];
    console.log(`
Command: ${def.command}
Description: ${def.description}
Usage:
  legiscan-client ${def.command} ${def.params}
    `.trim());
  } else {
    // if the command wasn't found, list all possible commands
    var verbs = Object.keys(commands).filter(c => c != "help");
    var longest = Math.max(...verbs.map(v => v.length)) + 2;
    var listing = verbs.sort().map(k => `  ${commands[k].command.padEnd(longest, " ")} ${commands[k].description}`);
    console.log(`
Legiscan Client by Civic News

Run a particular command with the form:

  legiscan-client COMMAND

Available commands:
${listing.join("\n")}

Show required and optional parameters for a specific command via:

  legiscan-client help COMMAND
    `.trim());
  }
} else {
  requested.run();
}