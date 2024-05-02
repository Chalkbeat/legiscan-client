# Legiscan API Client

A Node-based library for accessing the Legiscan database of US state legislation. You will need an API key from https://legiscan.com/legiscan in order to use this client. Best-practice code examples from actual reporting at Chalkbeat are available in the `samples` folder.

This package also installs a command-line client that can be run with the `legiscan-client` command, either for manual access or integration with other languages.

# Getting started

To interact with the API, import and create an instance of the `LegiscanClient` class, which takes an API key as its argument. You can also set the `$LEGISCAN_API_KEY` environment variable, and then the client will pick that up instead.

```js
import { LegiscanClient } from "legiscan-client";
// providing an API key directly:
let legiscan = new LegiscanClient(API_KEY);
// with the environment variable:
let legiscan = new LegiscanClient();
```

The client provides async methods corresponding to each API call. For example, to run a search and get bill details, you could run the following code:

```js
let results = await client.getSearch("education AND javascript");
for (let result of results) {
  var details = await client.getBill(result.bill_id);
  Object.assign(result, details);
}
```

Generally, the objects returned by the client methods will match the schema described in the [API documentation](https://legiscan.com/misc/LegiScan_API_User_Manual.pdf), but with some normalization applied. For example, when calling `getBill`, the status, event, and sponsor type fields will be normalized to their string representations, with an added `*_id` property containing the numerical code. This is meant to create more consistency between API calls, some of which return flags as strings and some as numerical codes.

# CLI

When installed globally, or when executed from an `npm run` script, the `legiscan-client` command provides [ND-JSON](https://github.com/ndjson/ndjson-spec) output from API calls. Some of these calls return a lot of results, or need to be filtered, and that's easier to do with newline-delimited output in languages and tools that support streaming from invoked processes.

The command line takes a case-insensitive API method name as its first argument, followed by positional arguments for required input and flags for optional parameters matching the Legiscan documentation:

```sh
# getBill always wants an ID
legiscan-client getbill 174039

# you can also provide this with a flag
legiscan-client getbill --id=174039

# getsearch example
legiscan-client getbill "education AND gender" --state=TN
```

# Best practices

## Caching

The Legiscan API limits users to 30,000 requests per month (resetting on the 1st). This may seem like a lot, unless you're a journalist who does a lot of scraping, or until you start pulling all legislation for an active session in, say, Michigan (about 3,000 bills as of April 2024). Since you cannot get many parts of the bill status without individual calls to the `getBill` method, your token usage can add up quickly.

As a result, it is extremely important to add a caching layer whenever you use the API client for anything involving bill details. For example, in the `samples/michigan.js` file, you can see where we use a SQLite database as a key/value store:

```js
import Database from "better-sqlite3";
var cache = new Database("cache.db");
cache.exec(`CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, value TEXT);`);
var getCached = cache.prepare(`SELECT value FROM cache WHERE key = ?;`).pluck();
var setCached = cache.prepare(`INSERT INTO cache VALUES (?, ?);`);
```

Each bill returned from a Legiscan API call includes a `change_hash` ID that is unique to that particular bill revision. Using that hash as a key, you can only make requests when the bill is updated, and otherwise pull from the database to save a request:

```js
var hash = bill.change_hash;

var details = getCached.get(hash);
if (details) {
  // use the cached info
  cachedCount++;
  details = JSON.parse(details);
} else {
  // get a fresh copy and cache it
  details = await client.getBill(bill.bill_id);
  setCached.run(hash, JSON.stringify(details));
}
```

This is, of course, a kind of Minimum Viable Cache, and if you're using a database more extensively for storing persistent legislative data, you can probably just adapt it. Conversely, if you're only getting master lists or searches and don't really care about the bill details, it may be possible (although probably not advisable) to hit the API directly. We do not ship a cache layer in the client itself, because we believe it's better for you to be in control of response freshness based on your specific needs.