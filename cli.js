#!/usr/bin/env node

import minimist from "minimist";
import { LegiscanClient } from "./client.js";
import fs from "node:fs";
import path from "node:path";
import { parse } from "comment-parser";

var client = new LegiscanClient();
var argv = minimist(process.argv);

var [node, _, command, ...positional] = argv._;
var [ first ] = positional;

function stringify(obj) {
  if (obj instanceof Array) {
    for (var item of obj) {
      console.log(JSON.stringify(item));
    }
  } else {
    console.log(JSON.stringify(obj));
  }
}

// functions to turn command line arguments into method signature form
// most methods just take the id
const translations = {
  standard: ({ id }) => [ id || first],
  getSearch: ({ state, year }) => [first, { state, year }],
  getMasterList: ({ state, id }) => [{ state, id }],
  getSessionList: ({ state }) => [state || first]
};

// The CLI is generated from JSDoc comments in the client.js file
// Methods tagged with @cli will be exposed and included in the help file
var clientSource = fs.readFileSync(path.resolve(import.meta.dirname, "client.js"), "utf-8");
var parsed = parse(clientSource);
var commands = {};
// find @cli comments and add them as commands
for (var comment of parsed) {
  var cli = comment.tags.find(t => t.tag == "cli");
  if (!cli) continue;
  var definition = {
    method: cli.name,
    description: comment.description,
    // ignore the raw params object, since it's just for JS autocomplete
    params: comment.tags.filter(t => t.tag == "param" && t.name != "params"),
    // load a custom translation for variant method signatures
    translate: cli.name in translations ? translations[cli.name] : translations.standard
  };
  // pre-process parameter values for the help text
  for (var p of definition.params) {
    p.optional = p.optional ? "[optional] " : "";
    p.cliName = p.name.toUpperCase();
    if (p.name.match(/^params/)) {
      p.cliName = p.name.replace("params.", "--").toLowerCase();
      p.flag = true;
    }
  }
  commands[cli.name.toLowerCase()] = definition;
}

// get the selected command from the dictionary and execute it
var requested = commands[command];
// if not found, show some variation on help
// "legsican-client help" also conveniently triggers this since there's no client.help()
if (!requested) {
  // show help for a specific command
  if (first && first.toLowerCase() in commands) {
    var def = commands[first.toLowerCase()];
    var longestParam = Math.max(...def.params.map(p => p.cliName.length));
    var usageParams = def.params.map(p => {
      var name = p.cliName;
      if (p.flag) {
        name += "=??";
      }
      if (p.optional) {
        name = `[${name}]`
      }
      return name;
    });
    var paramList = def.params.map(p => `  ${p.cliName.padEnd(longestParam, " ")} - ${p.optional}${p.description}`);
    console.log(`
Command: ${def.method}
Description: ${def.description}
Usage:
  legiscan-client ${def.method} ${usageParams.join(" ")}

Parameters:
${paramList.join("\n")}
    `.trim());
  } else {
    // if the command wasn't found, list all possible commands
    var verbs = Object.keys(commands);
    var longest = Math.max(...verbs.map(v => v.length)) + 2;
    var listing = verbs.sort().map(k => `  ${commands[k].method.padEnd(longest, " ")} ${commands[k].description}`);
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
  var { method, translate } = requested;
  // get command-line flags and convert them into a method argument list
  var args = translate(argv);
  var result = await client[method](...args);
  stringify(result);
}