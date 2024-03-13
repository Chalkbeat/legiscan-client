let Database = require('better-sqlite3');

let db = new Database('legiscan.db', { verbose: console.log });

// object formatting
var layout = db.pragma("table_info(bills)");
var defaultObject = Object.fromEntries(layout.map(c => [c.name, c.dflt_value]));

db.exec(`
DROP TABLE IF EXISTS queries;
CREATE TABLE queries (
    bill_id TEXT
    ,relevance INTEGER
    ,searchTerm TEXT
);
`);

db.exec(`
DROP TABLE IF EXISTS bills;
CREATE TABLE bills (
    bill_id TEXT
    ,relevance INTEGER
    ,state TEXT
    ,bill_number TEXT
    ,change_hash TEXT
    ,url TEXT
    ,text_url TEXT
    ,research_url TEXT
    ,last_action_date TEXT
    ,last_action TEXT
    ,title TEXT
    ,session_id TEXT
    ,state_id TEXT
    ,year_start TEXT
    ,year_end TEXT
    ,session_tag TEXT
    ,session_title TEXT
    ,session_name TEXT
    ,state_link TEXT
    ,status TEXT
    ,status_date DATE
    ,completed INTEGER
    ,bill_type TEXT
    ,bill_type_id TEXT
    ,body TEXT
    ,body_id INTEGER
    ,current_body TEXT
    ,current_body_id INTEGER
    ,description TEXT
);
`);

let tableQuery = db.prepare('SELECT NAME FROM SQLITE_SCHEMA;');
let tables = tableQuery.all();

/* we probably only want to create tables on first run? 
pass in a flag to refresh data 
if either table array empty or pass in wipeout flag, then run drop/create
otherwise, skip to load */

let insertQuery = db.prepare(`INSERT INTO queries VALUES ($bill_id, $relevance, $searchTerm);`);

let prepareBill = db.prepare(`INSERT INTO bills VALUES ($bill_id,$relevance,$state,$bill_number,$change_hash,$url,$text_url,$research_url,$last_action_date,$last_action,$title,$session_id,$state_id,$year_start,$year_end,$session_tag,$session_title,$session_name,$state_link,$status,$status_date,$completed,$bill_type,$bill_type_id,$body,$body_id,$current_body,$current_body_id,$description);`);

let prepQuery = db.prepare(`
SELECT DISTINCT
  bill_id
  ,searchTerm
FROM queries
;`);

let countQueries = db.prepare(`
  SELECT
    count(searchTerm)
    , bill_id
  FROM queries

  group by bill_id
;`);

// const insertQueries = db.transaction((hits) => {
//   for (const hit of hits) insertQuery.run(hit);
// });

// insertQuery.run({ bill_id: bill_id, relevance: relevance, searchTerm: searchTerm });

let logRows = db.prepare(`SELECT DISTINCT searchTerm FROM queries`);
console.log(logRows.all());

// normalize an object before submitting to SQL

function insertBill(data) {
  var normalized = Object.assign({}, defaultObject, data);
  prepareBill.run(normalized);
};

module.exports = { insertQuery, insertBill, logRows, countQueries };