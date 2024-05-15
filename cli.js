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

var commands = {
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
  getsessionlist: {
    async run() {
      var state = args.state || positional[0];
      var list = await client.getSessionList(state);
      for (var session of list) {
        stringify(session);
      }
    },
    command: "getSessionList",
    description: "Get all sessions for a state",
    params: "STATE"
  },
  getmasterlist: {
    async run() {
      for (var result of await client.getMasterList(args)) {
        stringify(result);
      }
    },
    command: "getMasterList",
    params: "[--state=POSTAL_CODE] [--id=SESSION_ID]",
    description: "Get all bills for a given state or session (at least one must be provided)"
  },
  help: {
    run() {
      var [ command ] = positional;
      if (command && command.toLowerCase() in commands) {
        var def = commands[command.toLowerCase()];
        console.log(`Command: ${def.command}
Description: ${def.description}
Usage: legiscan-client ${def.command} ${def.params}`);
      } else {
        var verbs = Object.keys(commands).filter(c => c != "help");
        var longest = Math.max(...verbs.map(v => v.length)) + 2;
        var listing = verbs.sort().map(k => {
          return `  ${commands[k].command.padEnd(longest, " ")} ${commands[k].description}`
        });
        console.log(`Legiscan Client by Civic News

Available commands:
${listing.join("\n")}

Show required and optional parameters for a specific command via:

legiscan-client help COMMAND
`);
      }
    },
    command: "help",
    description: "Show more information for a given command",
    params: "COMMAND"
  }
}

function defineSimpleCommand(command, description, multiple = false) {
  var one = async () => stringify(await client[command](id));
  var list = async () => {
    for (var result of await client[command](id)) {
      stringify(result);
    }
  };
  var run = multiple ? list : one;
  commands[command.toLowerCase()] = {
    run,
    command,
    description,
    params: "ID"
  }
}

defineSimpleCommand("getBill", "Get detailed bill information");
defineSimpleCommand("getBillText", "Get the text of a specific bill version");
defineSimpleCommand("getAmendment", "Get the text of an amendment");
defineSimpleCommand("getSupplement", "Get the text of a supplemental document");
defineSimpleCommand("getRollCall", "Get a roll call vote result for a bill");
defineSimpleCommand("getPerson", "Get the detailed profile for a person");
defineSimpleCommand("getSessionPeople", "Get all people involved in a given session", true);
defineSimpleCommand("getSponsoredList", "Get all sponsors for a bill", true);

var requested = commands[method];
if (!requested) {
  commands.help.run();
} else {
  requested.run();
}