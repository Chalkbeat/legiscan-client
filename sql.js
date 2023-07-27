let Database = require('better-sqlite3');

let db = new Database('legiscan.db', { verbose: console.log });

db.exec(`
DROP TABLE IF EXISTS queries;
CREATE TABLE queries (
    bill_id TEXT
    ,relevance INTEGER
    ,searchTerm TEXT
);
`);

// db.exec(`
// DROP TABLE IF EXISTS bills;
// CREATE TABLE bills (
//     bill_id TEXT
//     ,relevance INTEGER
//     ,state TEXT
//     ,bill_number TEXT
//     relevance: 89,
//     state: 'WA',
//     bill_number: 'SB5440',
//     bill_id: 1663111,
//     change_hash: 'daacc90a5584601325889f3d1a096078',
//     url: 'https://legiscan.com/WA/bill/SB5440/2023',
//     text_url: 'https://legiscan.com/WA/text/SB5440/2023',
//     research_url: 'https://legiscan.com/WA/research/SB5440/2023',
//     last_action_date: '2023-05-15',
//     last_action: 'Effective date 7/23/2023*.',
//     title: 'Providing timely competency evaluations and restoration services to persons suffering from behavioral health disorders.',
//     details: {
//       bill_id: 1663111,
//       change_hash: 'daacc90a5584601325889f3d1a096078',
//       session_id: 2037,
//       session: [Object],
//       url: 'https://legiscan.com/WA/bill/SB5440/2023',
//       state_link: 'https://app.leg.wa.gov/billsummary?BillNumber=5440&Year=2023&Initiative=false',
//       completed: 1,
//       status: 4,
//       status_date: '2023-05-15',
//       progress: [Array],
//       state: 'WA',
//       state_id: 47,
//       bill_number: 'SB5440',
//       bill_type: 'B',
//       bill_type_id: '1',
//       body: 'S',
//       body_id: 98,
//       current_body: 'S',
//       current_body_id: 98,
//       title: 'Providing timely competency evaluations and restoration services to persons suffering from behavioral health disorders.',
//       description: 'Providing timely competency evaluations and restoration services to persons suffering from behavioral health disorders.',
//       pending_committee_id: 0,
//       committee: [],
//       referrals: [Array],
//       history: [Array],
//       sponsors: [Array],
//       sasts: [],
//       subjects: [],
//       texts: [Array],
//       votes: [Array],
//       amendments: [Array],
//       supplements: [Array],
//       calendar: [Array]
//     }
// );
// `);

let tableQuery = db.prepare('SELECT NAME FROM SQLITE_SCHEMA;');
let tables = tableQuery.all();

/* we probably only want to create tables on first run? 
pass in a flag to refresh data 
if either table array empty or pass in wipeout flag, then run drop/create
otherwise, skip to load */

let insertQuery = db.prepare(`INSERT INTO queries VALUES ($bill_id, $relevance, $searchTerm);`);

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

module.exports = { insertQuery, logRows, countQueries };