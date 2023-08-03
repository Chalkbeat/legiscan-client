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
//   "state_link": "https://app.leg.wa.gov/billsummary?BillNumber=5048&Year=2023&Initiative=false",
//   "completed": 1,
//   "status": 4,
//   "status_date": "2023-05-04",
//   "progress": [
//     {
//       "date": "2023-01-09",
//       "event": 1
//     },
//     {
//       "date": "2023-01-09",
//       "event": 9
//     },
//     {
//       "date": "2023-01-18",
//       "event": 10
//     },
//     {
//       "date": "2023-01-20",
//       "event": 9
//     },
//     {
//       "date": "2023-02-23",
//       "event": 10
//     },
//     {
//       "date": "2023-03-08",
//       "event": 2
//     },
//     {
//       "date": "2023-03-10",
//       "event": 9
//     },
//     {
//       "date": "2023-03-24",
//       "event": 10
//     },
//     {
//       "date": "2023-03-28",
//       "event": 9
//     },
//     {
//       "date": "2023-04-04",
//       "event": 10
//     },
//     {
//       "date": "2023-04-04",
//       "event": 9
//     },
//     {
//       "date": "2023-04-20",
//       "event": 3
//     },
//     {
//       "date": "2023-05-04",
//       "event": 8
//     },
//     {
//       "date": "2023-05-04",
//       "event": 4
//     }
//   ],
//   "state_id": 47,
//   "bill_type": "B",
//   "bill_type_id": "1",
//   "body": "S",
//   "body_id": 98,
//   "current_body": "S",
//   "current_body_id": 98,
//   "description": "Eliminating college in the high school fees.",
//   "pending_committee_id": 0,
//   "committee": [],
//   "referrals": [
//     {
//       "date": "2023-01-09",
//       "committee_id": 955,
//       "chamber": "S",
//       "chamber_id": 98,
//       "name": "Higher Education & Workforce Development"
//     },
//     {
//       "date": "2023-01-20",
//       "committee_id": 962,
//       "chamber": "S",
//       "chamber_id": 98,
//       "name": "Ways & Means"
//     },
//     {
//       "date": "2023-02-24",
//       "committee_id": 960,
//       "chamber": "S",
//       "chamber_id": 98,
//       "name": "Rules"
//     },
//     {
//       "date": "2023-03-10",
//       "committee_id": 4674,
//       "chamber": "H",
//       "chamber_id": 97,
//       "name": "Postsecondary Education & Workforce"
//     },
//     {
//       "date": "2023-03-28",
//       "committee_id": 2759,
//       "chamber": "H",
//       "chamber_id": 97,
//       "name": "Appropriations"
//     },
//     {
//       "date": "2023-04-04",
//       "committee_id": 943,
//       "chamber": "H",
//       "chamber_id": 97,
//       "name": "Rules"
//     }
//   ],
//   "history": [
//     {
//       "date": "2022-12-15",
//       "action": "Prefiled for introduction.",
//       "chamber": "S",
//       "chamber_id": 98,
//       "importance": 0
//     },
//     {
//       "date": "2023-01-09",
//       "action": "First reading, referred to Higher Education & Workforce Development.",
//       "chamber": "S",
//       "chamber_id": 98,
//       "importance": 1
//     },
//     {
//       "date": "2023-01-11",
//       "action": "Public hearing in the Senate Committee on Higher Education & Workforce Development at 8:00 AM.",
//       "chamber": "S",
//       "chamber_id": 98,
//       "importance": 0
//     },
//     {
//       "date": "2023-01-18",
//       "action": "Executive action taken in the Senate Committee on Higher Education & Workforce Development at 8:00 AM.",
//       "chamber": "S",
//       "chamber_id": 98,
//       "importance": 0
//     },
//     {
//       "date": "2023-01-18",
//       "action": "HEWD - Majority; 1st substitute bill be substituted, do pass.",
//       "chamber": "S",
//       "chamber_id": 98,
//       "importance": 1
//     },
//     {
//       "date": "2023-01-18",
//       "action": "And refer to Ways & Means.",
//       "chamber": "S",
//       "chamber_id": 98,
//       "importance": 0
//     },
//     {
//       "date": "2023-01-20",
//       "action": "Referred to Ways & Means.",
//       "chamber": "S",
//       "chamber_id": 98,
//       "importance": 1
//     },
//     {
//       "date": "2023-02-18",
//       "action": "Public hearing in the Senate Committee on Ways & Means at 9:00 AM.",
//       "chamber": "S",
//       "chamber_id": 98,
//       "importance": 0
//     },
//     {
//       "date": "2023-02-23",
//       "action": "Executive action taken in the Senate Committee on Ways & Means at 9:00 AM.",
//       "chamber": "S",
//       "chamber_id": 98,
//       "importance": 0
//     },
//     {
//       "date": "2023-02-23",
//       "action": "WM - Majority; 2nd substitute bill be substituted, do pass.",
//       "chamber": "S",
//       "chamber_id": 98,
//       "importance": 1
//     },
//     {
//       "date": "2023-02-24",
//       "action": "Passed to Rules Committee for second reading.",
//       "chamber": "S",
//       "chamber_id": 98,
//       "importance": 0
//     },
//     {
//       "date": "2023-03-06",
//       "action": "Placed on second reading by Rules Committee.",
//       "chamber": "S",
//       "chamber_id": 98,
//       "importance": 0
//     },
//     {
//       "date": "2023-03-08",
//       "action": "2nd substitute bill substituted",
//       "chamber": "S",
//       "chamber_id": 98,
//       "importance": 0
//     },
//     {
//       "date": "2023-03-08",
//       "action": "Rules suspended. Placed on Third Reading.",
//       "chamber": "S",
//       "chamber_id": 98,
//       "importance": 0
//     },
//     {
//       "date": "2023-03-08",
//       "action": "Third reading, passed; yeas, 48; nays, 0; absent, 0; excused, 1.",
//       "chamber": "S",
//       "chamber_id": 98,
//       "importance": 1
//     },
//     {
//       "date": "2023-03-10",
//       "action": "First reading, referred to Postsecondary Education & Workforce.",
//       "chamber": "H",
//       "chamber_id": 97,
//       "importance": 1
//     },
//     {
//       "date": "2023-03-21",
//       "action": "Public hearing in the House Committee on Postsecondary Education & Workforce at 1:30 PM.",
//       "chamber": "H",
//       "chamber_id": 97,
//       "importance": 0
//     },
//     {
//       "date": "2023-03-24",
//       "action": "Executive action taken in the House Committee on Postsecondary Education & Workforce at 8:00 AM.",
//       "chamber": "H",
//       "chamber_id": 97,
//       "importance": 0
//     },
//     {
//       "date": "2023-03-24",
//       "action": "PEW - Majority; do pass with amendment",
//       "chamber": "H",
//       "chamber_id": 97,
//       "importance": 1
//     },
//     {
//       "date": "2023-03-28",
//       "action": "Referred to Appropriations.",
//       "chamber": "H",
//       "chamber_id": 97,
//       "importance": 1
//     },
//     {
//       "date": "2023-04-01",
//       "action": "Public hearing in the House Committee on Appropriations at 9:00 AM.",
//       "chamber": "H",
//       "chamber_id": 97,
//       "importance": 0
//     },
//     {
//       "date": "2023-04-04",
//       "action": "Executive action taken in the House Committee on Appropriations at 9:00 AM.",
//       "chamber": "H",
//       "chamber_id": 97,
//       "importance": 0
//     },
//     {
//       "date": "2023-04-04",
//       "action": "APP - Majority; do pass with amendment",
//       "chamber": "H",
//       "chamber_id": 97,
//       "importance": 1
//     },
//     {
//       "date": "2023-04-04",
//       "action": "Minority; do not pass.",
//       "chamber": "H",
//       "chamber_id": 97,
//       "importance": 0
//     },
//     {
//       "date": "2023-04-04",
//       "action": "Minority; without recommendation.",
//       "chamber": "H",
//       "chamber_id": 97,
//       "importance": 0
//     },
//     {
//       "date": "2023-04-04",
//       "action": "Referred to Rules 2 Review.",
//       "chamber": "H",
//       "chamber_id": 97,
//       "importance": 1
//     },
//     {
//       "date": "2023-04-10",
//       "action": "Rules Committee relieved of further consideration. Placed on second reading.",
//       "chamber": "H",
//       "chamber_id": 97,
//       "importance": 0
//     },
//     {
//       "date": "2023-04-12",
//       "action": "Committee amendment adopted and floor amendment",
//       "chamber": "H",
//       "chamber_id": 97,
//       "importance": 0
//     },
//     {
//       "date": "2023-04-12",
//       "action": "Rules suspended. Placed on Third Reading.",
//       "chamber": "H",
//       "chamber_id": 97,
//       "importance": 0
//     },
//     {
//       "date": "2023-04-12",
//       "action": "Third reading, passed; yeas, 97; nays, 0; absent, 0; excused, 1.",
//       "chamber": "H",
//       "chamber_id": 97,
//       "importance": 0
//     },
//     {
//       "date": "2023-04-14",
//       "action": "Senate concurred in House amendments.",
//       "chamber": "S",
//       "chamber_id": 98,
//       "importance": 0
//     },
//     {
//       "date": "2023-04-14",
//       "action": "Passed final passage; yeas, 46; nays, 0; absent, 0; excused, 3.",
//       "chamber": "S",
//       "chamber_id": 98,
//       "importance": 0
//     },
//     {
//       "date": "2023-04-19",
//       "action": "President signed.",
//       "chamber": "S",
//       "chamber_id": 98,
//       "importance": 0
//     },
//     {
//       "date": "2023-04-20",
//       "action": "Speaker signed.",
//       "chamber": "H",
//       "chamber_id": 97,
//       "importance": 0
//     },
//     {
//       "date": "2023-04-20",
//       "action": "Delivered to Governor.",
//       "chamber": "S",
//       "chamber_id": 98,
//       "importance": 1
//     },
//     {
//       "date": "2023-05-04",
//       "action": "Governor signed.",
//       "chamber": "S",
//       "chamber_id": 98,
//       "importance": 0
//     },
//     {
//       "date": "2023-05-04",
//       "action": "Chapter 314, 2023 Laws.",
//       "chamber": "S",
//       "chamber_id": 98,
//       "importance": 1
//     },
//     {
//       "date": "2023-05-04",
//       "action": "Effective date 7/23/2023.",
//       "chamber": "S",
//       "chamber_id": 98,
//       "importance": 0
//     }
//   ],
//   "sponsors": [
//     {
//       "people_id": 14833,
//       "person_hash": "0yzln07v",
//       "party_id": "1",
//       "state_id": 47,
//       "party": "D",
//       "role_id": 2,
//       "role": "Sen",
//       "name": "Mark Mullet",
//       "first_name": "Mark",
//       "middle_name": "D.",
//       "last_name": "Mullet",
//       "suffix": "",
//       "nickname": "",
//       "district": "SD-005",
//       "ftm_eid": 2764763,
//       "votesmart_id": 140187,
//       "opensecrets_id": "",
//       "knowwho_pid": 420884,
//       "ballotpedia": "Mark_Mullet",
//       "bioguide_id": "",
//       "sponsor_type_id": 1,
//       "sponsor_order": 1,
//       "committee_sponsor": 0,
//       "committee_id": 0,
//       "state_federal": 0
//     },
//     {
//       "people_id": 3555,
//       "person_hash": "h1ewyw2j",
//       "party_id": "1",
//       "state_id": 47,
//       "party": "D",
//       "role_id": 2,
//       "role": "Sen",
//       "name": "Christine Rolfes",
//       "first_name": "Christine",
//       "middle_name": "Nasser",
//       "last_name": "Rolfes",
//       "suffix": "",
//       "nickname": "",
//       "district": "SD-023",
//       "ftm_eid": 3607851,
//       "votesmart_id": 65880,
//       "opensecrets_id": "",
//       "knowwho_pid": 248674,
//       "ballotpedia": "Christine_Rolfes",
//       "bioguide_id": "",
//       "sponsor_type_id": 2,
//       "sponsor_order": 2,
//       "committee_sponsor": 0,
//       "committee_id": 0,
//       "state_federal": 0
//     },
//     {
//       "people_id": 10547,
//       "person_hash": "9sdyre7k",
//       "party_id": "1",
//       "state_id": 47,
//       "party": "D",
//       "role_id": 2,
//       "role": "Sen",
//       "name": "Andrew Billig",
//       "first_name": "Andrew",
//       "middle_name": "S.",
//       "last_name": "Billig",
//       "suffix": "",
//       "nickname": "Andy",
//       "district": "SD-003",
//       "ftm_eid": 2648695,
//       "votesmart_id": 126294,
//       "opensecrets_id": "",
//       "knowwho_pid": 296265,
//       "ballotpedia": "Andy_Billig",
//       "bioguide_id": "",
//       "sponsor_type_id": 2,
//       "sponsor_order": 3,
//       "committee_sponsor": 0,
//       "committee_id": 0,
//       "state_federal": 0
//     },
//     {
//       "people_id": 3525,
//       "person_hash": "2wjdertm",
//       "party_id": "1",
//       "state_id": 47,
//       "party": "D",
//       "role_id": 2,
//       "role": "Sen",
//       "name": "Robert Hasegawa",
//       "first_name": "Robert",
//       "middle_name": "A.",
//       "last_name": "Hasegawa",
//       "suffix": "",
//       "nickname": "Bob",
//       "district": "SD-011",
//       "ftm_eid": 2644787,
//       "votesmart_id": 51576,
//       "opensecrets_id": "",
//       "knowwho_pid": 226598,
//       "ballotpedia": "Bob_Hasegawa",
//       "bioguide_id": "",
//       "sponsor_type_id": 2,
//       "sponsor_order": 4,
//       "committee_sponsor": 0,
//       "committee_id": 0,
//       "state_federal": 0
//     },
//     {
//       "people_id": 15064,
//       "person_hash": "1jdk2adq",
//       "party_id": "2",
//       "state_id": 47,
//       "party": "R",
//       "role_id": 2,
//       "role": "Sen",
//       "name": "Brad Hawkins",
//       "first_name": "Brad",
//       "middle_name": "M.",
//       "last_name": "Hawkins",
//       "suffix": "",
//       "nickname": "",
//       "district": "SD-012",
//       "ftm_eid": 3133030,
//       "votesmart_id": 140108,
//       "opensecrets_id": "",
//       "knowwho_pid": 421084,
//       "ballotpedia": "Brad_Hawkins",
//       "bioguide_id": "",
//       "sponsor_type_id": 2,
//       "sponsor_order": 5,
//       "committee_sponsor": 0,
//       "committee_id": 0,
//       "state_federal": 0
//     },
//     {
//       "people_id": 14815,
//       "person_hash": "1lwrrt58",
//       "party_id": "2",
//       "state_id": 47,
//       "party": "R",
//       "role_id": 2,
//       "role": "Sen",
//       "name": "Jeff Holy",
//       "first_name": "Jeff",
//       "middle_name": "",
//       "last_name": "Holy",
//       "suffix": "",
//       "nickname": "",
//       "district": "SD-006",
//       "ftm_eid": 3591632,
//       "votesmart_id": 140096,
//       "opensecrets_id": "",
//       "knowwho_pid": 421049,
//       "ballotpedia": "Jeff_Holy",
//       "bioguide_id": "",
//       "sponsor_type_id": 2,
//       "sponsor_order": 6,
//       "committee_sponsor": 0,
//       "committee_id": 0,
//       "state_federal": 0
//     },
//     {
//       "people_id": 3531,
//       "person_hash": "pi128hpu",
//       "party_id": "1",
//       "state_id": 47,
//       "party": "D",
//       "role_id": 2,
//       "role": "Sen",
//       "name": "Marko Liias",
//       "first_name": "Marko",
//       "middle_name": "",
//       "last_name": "Liias",
//       "suffix": "",
//       "nickname": "",
//       "district": "SD-021",
//       "ftm_eid": 2880655,
//       "votesmart_id": 102020,
//       "opensecrets_id": "",
//       "knowwho_pid": 262126,
//       "ballotpedia": "Marko_Liias",
//       "bioguide_id": "",
//       "sponsor_type_id": 2,
//       "sponsor_order": 7,
//       "committee_sponsor": 0,
//       "committee_id": 0,
//       "state_federal": 0
//     },
//     {
//       "people_id": 20596,
//       "person_hash": "ajz3f93i",
//       "party_id": "1",
//       "state_id": 47,
//       "party": "D",
//       "role_id": 2,
//       "role": "Sen",
//       "name": "Joe Nguyen",
//       "first_name": "Joe",
//       "middle_name": "",
//       "last_name": "Nguyen",
//       "suffix": "",
//       "nickname": "",
//       "district": "SD-034",
//       "ftm_eid": 45285238,
//       "votesmart_id": 183064,
//       "opensecrets_id": "",
//       "knowwho_pid": 666728,
//       "ballotpedia": "Joe_Nguyen",
//       "bioguide_id": "",
//       "sponsor_type_id": 2,
//       "sponsor_order": 8,
//       "committee_sponsor": 0,
//       "committee_id": 0,
//       "state_federal": 0
//     },
//     {
//       "people_id": 3577,
//       "person_hash": "dm5g3i1c",
//       "party_id": "1",
//       "state_id": 47,
//       "party": "D",
//       "role_id": 2,
//       "role": "Sen",
//       "name": "Jamie Pedersen",
//       "first_name": "Jamie",
//       "middle_name": "D.",
//       "last_name": "Pedersen",
//       "suffix": "",
//       "nickname": "",
//       "district": "SD-043",
//       "ftm_eid": 2826410,
//       "votesmart_id": 66760,
//       "opensecrets_id": "",
//       "knowwho_pid": 248683,
//       "ballotpedia": "Jamie_Pedersen",
//       "bioguide_id": "",
//       "sponsor_type_id": 2,
//       "sponsor_order": 9,
//       "committee_sponsor": 0,
//       "committee_id": 0,
//       "state_federal": 0
//     },
//     {
//       "people_id": 19399,
//       "person_hash": "fmm8d0rz",
//       "party_id": "1",
//       "state_id": 47,
//       "party": "D",
//       "role_id": 2,
//       "role": "Sen",
//       "name": "Javier Valdez",
//       "first_name": "Javier",
//       "middle_name": "",
//       "last_name": "Valdez",
//       "suffix": "",
//       "nickname": "",
//       "district": "SD-046",
//       "ftm_eid": 44273136,
//       "votesmart_id": 176532,
//       "opensecrets_id": "",
//       "knowwho_pid": 628493,
//       "ballotpedia": "Javier_Valdez",
//       "bioguide_id": "",
//       "sponsor_type_id": 2,
//       "sponsor_order": 10,
//       "committee_sponsor": 0,
//       "committee_id": 0,
//       "state_federal": 0
//     },
//     {
//       "people_id": 19513,
//       "person_hash": "nszkqzbo",
//       "party_id": "2",
//       "state_id": 47,
//       "party": "R",
//       "role_id": 2,
//       "role": "Sen",
//       "name": "Keith Wagoner",
//       "first_name": "Keith",
//       "middle_name": "",
//       "last_name": "Wagoner",
//       "suffix": "",
//       "nickname": "",
//       "district": "SD-039",
//       "ftm_eid": 36827664,
//       "votesmart_id": 177725,
//       "opensecrets_id": "",
//       "knowwho_pid": 650205,
//       "ballotpedia": "Keith_Wagoner",
//       "bioguide_id": "",
//       "sponsor_type_id": 2,
//       "sponsor_order": 11,
//       "committee_sponsor": 0,
//       "committee_id": 0,
//       "state_federal": 0
//     },
//     {
//       "people_id": 3523,
//       "person_hash": "iy99d6yf",
//       "party_id": "2",
//       "state_id": 47,
//       "party": "R",
//       "role_id": 2,
//       "role": "Sen",
//       "name": "Judith Warnick",
//       "first_name": "Judith",
//       "middle_name": "",
//       "last_name": "Warnick",
//       "suffix": "",
//       "nickname": "Judy",
//       "district": "SD-013",
//       "ftm_eid": 13007605,
//       "votesmart_id": 67062,
//       "opensecrets_id": "",
//       "knowwho_pid": 248670,
//       "ballotpedia": "Judith_Warnick",
//       "bioguide_id": "",
//       "sponsor_type_id": 2,
//       "sponsor_order": 12,
//       "committee_sponsor": 0,
//       "committee_id": 0,
//       "state_federal": 0
//     },
//     {
//       "people_id": 18501,
//       "person_hash": "z7hgkep7",
//       "party_id": "1",
//       "state_id": 47,
//       "party": "D",
//       "role_id": 2,
//       "role": "Sen",
//       "name": "Lisa Wellman",
//       "first_name": "Lisa",
//       "middle_name": "",
//       "last_name": "Wellman",
//       "suffix": "",
//       "nickname": "",
//       "district": "SD-041",
//       "ftm_eid": 40587957,
//       "votesmart_id": 171027,
//       "opensecrets_id": "",
//       "knowwho_pid": 583543,
//       "ballotpedia": "Lisa_Wellman",
//       "bioguide_id": "",
//       "sponsor_type_id": 2,
//       "sponsor_order": 13,
//       "committee_sponsor": 0,
//       "committee_id": 0,
//       "state_federal": 0
//     },
//     {
//       "people_id": 20600,
//       "person_hash": "rbz33zju",
//       "party_id": "1",
//       "state_id": 47,
//       "party": "D",
//       "role_id": 2,
//       "role": "Sen",
//       "name": "Claire Wilson",
//       "first_name": "Claire",
//       "middle_name": "",
//       "last_name": "Wilson",
//       "suffix": "",
//       "nickname": "",
//       "district": "SD-030",
//       "ftm_eid": 22056792,
//       "votesmart_id": 183049,
//       "opensecrets_id": "",
//       "knowwho_pid": 666720,
//       "ballotpedia": "Claire_Wilson",
//       "bioguide_id": "",
//       "sponsor_type_id": 2,
//       "sponsor_order": 14,
//       "committee_sponsor": 0,
//       "committee_id": 0,
//       "state_federal": 0
//     }
//   ],
//   "sasts": [],
//   "subjects": [],
//   "texts": [
//     {
//       "doc_id": 2618849,
//       "date": "0000-00-00",
//       "type": "Introduced",
//       "type_id": 1,
//       "mime": "application/pdf",
//       "mime_id": 2,
//       "url": "https://legiscan.com/WA/text/SB5048/id/2618849",
//       "state_link": "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Bills/Senate%20Bills/5048.pdf",
//       "text_size": 101177,
//       "text_hash": "9067de7044bc5eced4f56ad0476f847d",
//       "alt_bill_text": 0,
//       "alt_mime": "",
//       "alt_mime_id": 0,
//       "alt_state_link": "",
//       "alt_text_size": 0,
//       "alt_text_hash": ""
//     },
//     {
//       "doc_id": 2652730,
//       "date": "0000-00-00",
//       "type": "Comm Sub",
//       "type_id": 2,
//       "mime": "application/pdf",
//       "mime_id": 2,
//       "url": "https://legiscan.com/WA/text/SB5048/id/2652730",
//       "state_link": "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Bills/Senate%20Bills/5048-S.pdf",
//       "text_size": 101946,
//       "text_hash": "9d898baee9a41e1748f6bbdd7a75583f",
//       "alt_bill_text": 0,
//       "alt_mime": "",
//       "alt_mime_id": 0,
//       "alt_state_link": "",
//       "alt_text_size": 0,
//       "alt_text_hash": ""
//     },
//     {
//       "doc_id": 2716302,
//       "date": "0000-00-00",
//       "type": "Comm Sub",
//       "type_id": 2,
//       "mime": "application/pdf",
//       "mime_id": 2,
//       "url": "https://legiscan.com/WA/text/SB5048/id/2716302",
//       "state_link": "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Bills/Senate%20Bills/5048-S2.pdf",
//       "text_size": 105418,
//       "text_hash": "e10e5e3eeb04dcaf2db7828122909ad1",
//       "alt_bill_text": 0,
//       "alt_mime": "",
//       "alt_mime_id": 0,
//       "alt_state_link": "",
//       "alt_text_size": 0,
//       "alt_text_hash": ""
//     },
//     {
//       "doc_id": 2782198,
//       "date": "0000-00-00",
//       "type": "Enrolled",
//       "type_id": 5,
//       "mime": "application/pdf",
//       "mime_id": 2,
//       "url": "https://legiscan.com/WA/text/SB5048/id/2782198",
//       "state_link": "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Bills/Senate%20Passed%20Legislature/5048-S2.PL.pdf",
//       "text_size": 110915,
//       "text_hash": "de4231f53e616160f5eaff93c7b3c352",
//       "alt_bill_text": 0,
//       "alt_mime": "",
//       "alt_mime_id": 0,
//       "alt_state_link": "",
//       "alt_text_size": 0,
//       "alt_text_hash": ""
//     },
//     {
//       "doc_id": 2808473,
//       "date": "0000-00-00",
//       "type": "Chaptered",
//       "type_id": 6,
//       "mime": "application/pdf",
//       "mime_id": 2,
//       "url": "https://legiscan.com/WA/text/SB5048/id/2808473",
//       "state_link": "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Bills/Session%20Laws/Senate/5048-S2.SL.pdf",
//       "text_size": 116933,
//       "text_hash": "5e7abaa11b2a2a2bef9858fd845ef443",
//       "alt_bill_text": 0,
//       "alt_mime": "",
//       "alt_mime_id": 0,
//       "alt_state_link": "",
//       "alt_text_size": 0,
//       "alt_text_hash": ""
//     }
//   ],
//   "votes": [
//     {
//       "roll_call_id": 1233464,
//       "date": "2023-01-18",
//       "desc": "Senate Committee on Higher Education & Workforce Development: 1st substitute bill be substituted, do pass",
//       "yea": 5,
//       "nay": 0,
//       "nv": 0,
//       "absent": 0,
//       "total": 5,
//       "passed": 1,
//       "chamber": "S",
//       "chamber_id": 98,
//       "url": "https://legiscan.com/WA/rollcall/SB5048/id/1233464",
//       "state_link": "https://app.leg.wa.gov/billsummary/majorityminority/recommendation?type=majority&legId=126927&actionText=HEWD%20-%20Majority%3B%201st%20substitute%20bill%20be%20substituted%2C%20do%20pass.&mId=30336&isInit=False&biennium=2023-24"
//     },
//     {
//       "roll_call_id": 1260316,
//       "date": "2023-02-23",
//       "desc": "Senate Committee on Ways & Means: 2nd substitute bill be substituted, do pass",
//       "yea": 24,
//       "nay": 0,
//       "nv": 0,
//       "absent": 0,
//       "total": 24,
//       "passed": 1,
//       "chamber": "S",
//       "chamber_id": 98,
//       "url": "https://legiscan.com/WA/rollcall/SB5048/id/1260316",
//       "state_link": "https://app.leg.wa.gov/billsummary/majorityminority/recommendation?type=majority&legId=126927&actionText=WM%20-%20Majority%3B%202nd%20substitute%20bill%20be%20substituted%2C%20do%20pass.&mId=30852&isInit=False&biennium=2023-24"
//     },
//     {
//       "roll_call_id": 1270854,
//       "date": "2023-03-08",
//       "desc": "Senate 3rd Reading & Final Passage",
//       "yea": 48,
//       "nay": 0,
//       "nv": 0,
//       "absent": 1,
//       "total": 49,
//       "passed": 1,
//       "chamber": "S",
//       "chamber_id": 98,
//       "url": "https://legiscan.com/WA/rollcall/SB5048/id/1270854",
//       "state_link": "https://app.leg.wa.gov/billsummary/rollcall/vote?legId=126927&chamber=Senate&actionHistoryDate=03-08-2023&indexOnDayByChamber=1&billNumber=5048&isInit=False&biennium=2023-24"
//     },
//     {
//       "roll_call_id": 1284985,
//       "date": "2023-03-24",
//       "desc": "House Committee on Postsecondary Education & Workforce: do pass with amendment(s) by Postsecondary Education &amp; Workforce",
//       "yea": 15,
//       "nay": 0,
//       "nv": 0,
//       "absent": 0,
//       "total": 15,
//       "passed": 1,
//       "chamber": "H",
//       "chamber_id": 97,
//       "url": "https://legiscan.com/WA/rollcall/SB5048/id/1284985",
//       "state_link": "https://app.leg.wa.gov/billsummary/majorityminority/recommendation?type=majority&legId=126927&actionText=PEW%20-%20Majority%3B%20do%20pass%20with%20amendment%28s%29%20by%20Postsecondary%20Education%20%26amp%3B%20Workforce.&mId=31105&isInit=False&biennium="
//     },
//     {
//       "roll_call_id": 1293200,
//       "date": "2023-04-04",
//       "desc": "House Committee on Appropriations: do pass with amendment(s) but without amendment(s) by Postsecondary Education &amp; Workforce",
//       "yea": 22,
//       "nay": 6,
//       "nv": 3,
//       "absent": 0,
//       "total": 31,
//       "passed": 1,
//       "chamber": "H",
//       "chamber_id": 97,
//       "url": "https://legiscan.com/WA/rollcall/SB5048/id/1293200",
//       "state_link": "https://app.leg.wa.gov/billsummary/majorityminority/recommendation?type=majority&legId=126927&actionText=APP%20-%20Majority%3B%20do%20pass%20with%20amendment%28s%29%20but%20without%20amendment%28s%29%20by%20Postsecondary%20Education%20%26amp%3B%20Workforc"
//     },
//     {
//       "roll_call_id": 1299334,
//       "date": "2023-04-12",
//       "desc": "House Final Passage as Amended by the House",
//       "yea": 97,
//       "nay": 0,
//       "nv": 0,
//       "absent": 1,
//       "total": 98,
//       "passed": 1,
//       "chamber": "H",
//       "chamber_id": 97,
//       "url": "https://legiscan.com/WA/rollcall/SB5048/id/1299334",
//       "state_link": "https://app.leg.wa.gov/billsummary/rollcall/vote?legId=126927&chamber=House&actionHistoryDate=04-12-2023&indexOnDayByChamber=1&billNumber=5048&isInit=False&biennium=2023-24"
//     },
//     {
//       "roll_call_id": 1301718,
//       "date": "2023-04-14",
//       "desc": "Senate Final Passage as Amended by the House",
//       "yea": 46,
//       "nay": 0,
//       "nv": 0,
//       "absent": 3,
//       "total": 49,
//       "passed": 1,
//       "chamber": "S",
//       "chamber_id": 98,
//       "url": "https://legiscan.com/WA/rollcall/SB5048/id/1301718",
//       "state_link": "https://app.leg.wa.gov/billsummary/rollcall/vote?legId=126927&chamber=Senate&actionHistoryDate=04-14-2023&indexOnDayByChamber=1&billNumber=5048&isInit=False&biennium=2023-24"
//     }
//   ],
//   "amendments": [
//     {
//       "amendment_id": 167366,
//       "adopted": 0,
//       "chamber": "H",
//       "chamber_id": 97,
//       "date": "0000-00-00",
//       "title": "House Committee Amendment",
//       "description": "Postsecondary Education & Workforce 5048-S2 AMH PEW H1750.1",
//       "mime": "application/pdf",
//       "mime_id": 2,
//       "url": "https://legiscan.com/WA/amendment/SB5048/id/167366",
//       "state_link": "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Amendments/House/5048-S2%20AMH%20PEW%20H1750.1.pdf",
//       "amendment_size": 101892,
//       "amendment_hash": "554b01df7901ae9a65500ca7aac954e1",
//       "alt_amendment": 0,
//       "alt_mime": "",
//       "alt_mime_id": 0,
//       "alt_state_link": "",
//       "alt_amendment_size": 0,
//       "alt_amendment_hash": ""
//     },
//     {
//       "amendment_id": 172634,
//       "adopted": 0,
//       "chamber": "H",
//       "chamber_id": 97,
//       "date": "0000-00-00",
//       "title": "House Committee Amendment",
//       "description": "Appropriations 5048-S2 AMH APP H1872.1",
//       "mime": "application/pdf",
//       "mime_id": 2,
//       "url": "https://legiscan.com/WA/amendment/SB5048/id/172634",
//       "state_link": "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Amendments/House/5048-S2%20AMH%20APP%20H1872.1.pdf",
//       "amendment_size": 102570,
//       "amendment_hash": "250963a1e6de7c263764e9edc4730e1f",
//       "alt_amendment": 0,
//       "alt_mime": "",
//       "alt_mime_id": 0,
//       "alt_state_link": "",
//       "alt_amendment_size": 0,
//       "alt_amendment_hash": ""
//     },
//     {
//       "amendment_id": 173855,
//       "adopted": 0,
//       "chamber": "H",
//       "chamber_id": 97,
//       "date": "0000-00-00",
//       "title": "House Floor Amendment",
//       "description": "Corry 5048-S2 AMH CORR ROSS 027",
//       "mime": "application/pdf",
//       "mime_id": 2,
//       "url": "https://legiscan.com/WA/amendment/SB5048/id/173855",
//       "state_link": "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Amendments/House/5048-S2%20AMH%20CORR%20ROSS%20027.pdf",
//       "amendment_size": 15494,
//       "amendment_hash": "613d1598d9b400af6872659309041525",
//       "alt_amendment": 0,
//       "alt_mime": "",
//       "alt_mime_id": 0,
//       "alt_state_link": "",
//       "alt_amendment_size": 0,
//       "alt_amendment_hash": ""
//     },
//     {
//       "amendment_id": 173856,
//       "adopted": 0,
//       "chamber": "H",
//       "chamber_id": 97,
//       "date": "0000-00-00",
//       "title": "House Floor Amendment",
//       "description": "Corry 5048-S2 AMH CORR ROSS 029",
//       "mime": "application/pdf",
//       "mime_id": 2,
//       "url": "https://legiscan.com/WA/amendment/SB5048/id/173856",
//       "state_link": "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Amendments/House/5048-S2%20AMH%20CORR%20ROSS%20029.pdf",
//       "amendment_size": 18064,
//       "amendment_hash": "e52c2093da743d373eb3c9eb02d403e1",
//       "alt_amendment": 0,
//       "alt_mime": "",
//       "alt_mime_id": 0,
//       "alt_state_link": "",
//       "alt_amendment_size": 0,
//       "alt_amendment_hash": ""
//     },
//     {
//       "amendment_id": 174549,
//       "adopted": 0,
//       "chamber": "H",
//       "chamber_id": 97,
//       "date": "0000-00-00",
//       "title": "House Floor Amendment",
//       "description": "Corry 5048-S2 AMH CORR ROSS 032",
//       "mime": "application/pdf",
//       "mime_id": 2,
//       "url": "https://legiscan.com/WA/amendment/SB5048/id/174549",
//       "state_link": "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Amendments/House/5048-S2%20AMH%20CORR%20ROSS%20032.pdf",
//       "amendment_size": 27843,
//       "amendment_hash": "5bcf6069144f7549625402fc411af617",
//       "alt_amendment": 0,
//       "alt_mime": "",
//       "alt_mime_id": 0,
//       "alt_state_link": "",
//       "alt_amendment_size": 0,
//       "alt_amendment_hash": ""
//     },
//     {
//       "amendment_id": 174697,
//       "adopted": 1,
//       "chamber": "H",
//       "chamber_id": 97,
//       "date": "2023-04-12",
//       "title": "House Engrossed Amendment",
//       "description": " 5048-S2 AMH ENGR H1872.E",
//       "mime": "application/pdf",
//       "mime_id": 2,
//       "url": "https://legiscan.com/WA/amendment/SB5048/id/174697",
//       "state_link": "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Amendments/House/5048-S2%20AMH%20ENGR%20H1872.E.pdf",
//       "amendment_size": 106091,
//       "amendment_hash": "25ed412cb051a5e6d7c8aaf6cfc6e534",
//       "alt_amendment": 0,
//       "alt_mime": "",
//       "alt_mime_id": 0,
//       "alt_state_link": "",
//       "alt_amendment_size": 0,
//       "alt_amendment_hash": ""
//     }
//   ],
//   "supplements": [
//     {
//       "supplement_id": 289922,
//       "date": "0000-00-00",
//       "type": "Misc",
//       "type_id": 7,
//       "title": "Misc",
//       "description": "Senate Bill Report (Orig.)",
//       "mime": "application/pdf",
//       "mime_id": 2,
//       "url": "https://legiscan.com/WA/supplement/SB5048/id/289922",
//       "state_link": "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Bill%20Reports/Senate/5048%20SBA%20HEWD%2023.pdf",
//       "supplement_size": 8336,
//       "supplement_hash": "360ea37bfcbc8660ca7c0cfdec991b6c",
//       "alt_supplement": 0,
//       "alt_mime": "",
//       "alt_mime_id": 0,
//       "alt_state_link": "",
//       "alt_supplement_size": 0,
//       "alt_supplement_hash": ""
//     },
//     {
//       "supplement_id": 292373,
//       "date": "0000-00-00",
//       "type": "Misc",
//       "type_id": 7,
//       "title": "Misc",
//       "description": "Senate Bill Report",
//       "mime": "application/pdf",
//       "mime_id": 2,
//       "url": "https://legiscan.com/WA/supplement/SB5048/id/292373",
//       "state_link": "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Bill%20Reports/Senate/5048%20SBR%20HEWD%20OC%2023.pdf",
//       "supplement_size": 11314,
//       "supplement_hash": "ff7c49b0e81e489aee0cb5bd0cfa8d7a",
//       "alt_supplement": 0,
//       "alt_mime": "",
//       "alt_mime_id": 0,
//       "alt_state_link": "",
//       "alt_supplement_size": 0,
//       "alt_supplement_hash": ""
//     },
//     {
//       "supplement_id": 306460,
//       "date": "0000-00-00",
//       "type": "Misc",
//       "type_id": 7,
//       "title": "Misc",
//       "description": "Senate Bill Report",
//       "mime": "application/pdf",
//       "mime_id": 2,
//       "url": "https://legiscan.com/WA/supplement/SB5048/id/306460",
//       "state_link": "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Bill%20Reports/Senate/5048%20SBA%20WM%2023.pdf",
//       "supplement_size": 11466,
//       "supplement_hash": "f8612f951013bab115c099cecbc6445a",
//       "alt_supplement": 0,
//       "alt_mime": "",
//       "alt_mime_id": 0,
//       "alt_state_link": "",
//       "alt_supplement_size": 0,
//       "alt_supplement_hash": ""
//     },
//     {
//       "supplement_id": 310567,
//       "date": "0000-00-00",
//       "type": "Misc",
//       "type_id": 7,
//       "title": "Misc",
//       "description": "Senate Bill Report",
//       "mime": "application/pdf",
//       "mime_id": 2,
//       "url": "https://legiscan.com/WA/supplement/SB5048/id/310567",
//       "state_link": "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Bill%20Reports/Senate/5048%20SBR%20WM%20TA%2023.pdf",
//       "supplement_size": 11979,
//       "supplement_hash": "0b27be4c149f6963d2e33e3e44aff374",
//       "alt_supplement": 0,
//       "alt_mime": "",
//       "alt_mime_id": 0,
//       "alt_state_link": "",
//       "alt_supplement_size": 0,
//       "alt_supplement_hash": ""
//     },
//     {
//       "supplement_id": 311638,
//       "date": "0000-00-00",
//       "type": "Misc",
//       "type_id": 7,
//       "title": "Misc",
//       "description": "Senate Bill Report",
//       "mime": "application/pdf",
//       "mime_id": 2,
//       "url": "https://legiscan.com/WA/supplement/SB5048/id/311638",
//       "state_link": "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Bill%20Reports/Senate/5048%20SBR%20WM%20OC%2023.pdf",
//       "supplement_size": 13608,
//       "supplement_hash": "d6797c332b24ae20caef7cbd91b47816",
//       "alt_supplement": 0,
//       "alt_mime": "",
//       "alt_mime_id": 0,
//       "alt_state_link": "",
//       "alt_supplement_size": 0,
//       "alt_supplement_hash": ""
//     },
//     {
//       "supplement_id": 317944,
//       "date": "0000-00-00",
//       "type": "Misc",
//       "type_id": 7,
//       "title": "Misc",
//       "description": "Second Substitute Senate Bill Report",
//       "mime": "application/pdf",
//       "mime_id": 2,
//       "url": "https://legiscan.com/WA/supplement/SB5048/id/317944",
//       "state_link": "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Bill%20Reports/Senate/5048-S2%20SBR%20APS%2023.pdf",
//       "supplement_size": 12476,
//       "supplement_hash": "21e0a1bd80a8ac32bd055acddc037efc",
//       "alt_supplement": 0,
//       "alt_mime": "",
//       "alt_mime_id": 0,
//       "alt_state_link": "",
//       "alt_supplement_size": 0,
//       "alt_supplement_hash": ""
//     },
//     {
//       "supplement_id": 322971,
//       "date": "0000-00-00",
//       "type": "Misc",
//       "type_id": 7,
//       "title": "Misc",
//       "description": "Second Substitute House Bill Analysis 2023",
//       "mime": "application/pdf",
//       "mime_id": 2,
//       "url": "https://legiscan.com/WA/supplement/SB5048/id/322971",
//       "state_link": "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Bill%20Reports/House/5048-S2%20HBA%20PEW%2023.pdf",
//       "supplement_size": 9184,
//       "supplement_hash": "8f5281cb037f3ac16dd24db1542320f4",
//       "alt_supplement": 0,
//       "alt_mime": "",
//       "alt_mime_id": 0,
//       "alt_state_link": "",
//       "alt_supplement_size": 0,
//       "alt_supplement_hash": ""
//     },
//     {
//       "supplement_id": 328384,
//       "date": "0000-00-00",
//       "type": "Misc",
//       "type_id": 7,
//       "title": "Misc",
//       "description": "Second Substitute House Bill Report",
//       "mime": "application/pdf",
//       "mime_id": 2,
//       "url": "https://legiscan.com/WA/supplement/SB5048/id/328384",
//       "state_link": "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Bill%20Reports/House/5048-S2%20HBR%20PEW%2023.pdf",
//       "supplement_size": 15090,
//       "supplement_hash": "a1427b78fc0517353f38b3ebb80ba9b1",
//       "alt_supplement": 0,
//       "alt_mime": "",
//       "alt_mime_id": 0,
//       "alt_state_link": "",
//       "alt_supplement_size": 0,
//       "alt_supplement_hash": ""
//     },
//     {
//       "supplement_id": 348799,
//       "date": "0000-00-00",
//       "type": "Misc",
//       "type_id": 7,
//       "title": "Misc",
//       "description": "Second Substitute House Bill Report",
//       "mime": "application/pdf",
//       "mime_id": 2,
//       "url": "https://legiscan.com/WA/supplement/SB5048/id/348799",
//       "state_link": "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Bill%20Reports/House/5048-S2%20HBR%20APP%2023.pdf",
//       "supplement_size": 17448,
//       "supplement_hash": "9b8e1795112d62e61e3df2283bdfbdd1",
//       "alt_supplement": 0,
//       "alt_mime": "",
//       "alt_mime_id": 0,
//       "alt_state_link": "",
//       "alt_supplement_size": 0,
//       "alt_supplement_hash": ""
//     },
//     {
//       "supplement_id": 355653,
//       "date": "0000-00-00",
//       "type": "Misc",
//       "type_id": 7,
//       "title": "Misc",
//       "description": "Final Bill Report",
//       "mime": "application/pdf",
//       "mime_id": 2,
//       "url": "https://legiscan.com/WA/supplement/SB5048/id/355653",
//       "state_link": "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Bill%20Reports/Senate/5048-S2%20SBR%20FBR%2023.pdf",
//       "supplement_size": 9268,
//       "supplement_hash": "ae5af384dcbabb9c9b0ddbaabc84c13c",
//       "alt_supplement": 0,
//       "alt_mime": "",
//       "alt_mime_id": 0,
//       "alt_state_link": "",
//       "alt_supplement_size": 0,
//       "alt_supplement_hash": ""
//     },
//     {
//       "supplement_id": 357653,
//       "date": "0000-00-00",
//       "type": "Misc",
//       "type_id": 7,
//       "title": "Misc",
//       "description": "Second Substitute House Bill Report",
//       "mime": "application/pdf",
//       "mime_id": 2,
//       "url": "https://legiscan.com/WA/supplement/SB5048/id/357653",
//       "state_link": "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Bill%20Reports/House/5048-S2%20HBR%20APH%2023.pdf",
//       "supplement_size": 16985,
//       "supplement_hash": "adf9d435c5b5163df674f455ead9e180",
//       "alt_supplement": 0,
//       "alt_mime": "",
//       "alt_mime_id": 0,
//       "alt_state_link": "",
//       "alt_supplement_size": 0,
//       "alt_supplement_hash": ""
//     }
//   ],
//   "calendar": [
//     {
//       "type_id": 1,
//       "event_hash": "ef61790b",
//       "type": "Hearing",
//       "date": "2023-01-11",
//       "time": "08:00",
//       "location": "Senate Committee on Higher Education & Workforce Development",
//       "description": "Senate Committee on Higher Education & Workforce Development Public Hearing"
//     },
//     {
//       "type_id": 1,
//       "event_hash": "45248bcc",
//       "type": "Hearing",
//       "date": "2023-01-18",
//       "time": "08:00",
//       "location": "Senate Committee on Higher Education & Workforce Development",
//       "description": "Senate Committee on Higher Education & Workforce Development Executive Session"
//     },
//     {
//       "type_id": 1,
//       "event_hash": "5769cf75",
//       "type": "Hearing",
//       "date": "2023-02-18",
//       "time": "09:00",
//       "location": "Senate Committee on Ways & Means",
//       "description": "Senate Committee on Ways & Means Public Hearing"
//     },
//     {
//       "type_id": 1,
//       "event_hash": "e0cc9e37",
//       "type": "Hearing",
//       "date": "2023-02-23",
//       "time": "09:00",
//       "location": "Senate Committee on Ways & Means",
//       "description": "Senate Committee on Ways & Means Executive Session"
//     },
//     {
//       "type_id": 1,
//       "event_hash": "b55fd6da",
//       "type": "Hearing",
//       "date": "2023-03-21",
//       "time": "13:30",
//       "location": "House Committee on Postsecondary Education & Workforce",
//       "description": "House Committee on Postsecondary Education & Workforce Public Hearing"
//     },
//     {
//       "type_id": 1,
//       "event_hash": "4d8c5969",
//       "type": "Hearing",
//       "date": "2023-03-24",
//       "time": "08:00",
//       "location": "House Committee on Postsecondary Education & Workforce",
//       "description": "House Committee on Postsecondary Education & Workforce Executive Session"
//     },
//     {
//       "type_id": 1,
//       "event_hash": "1fb1b429",
//       "type": "Hearing",
//       "date": "2023-04-01",
//       "time": "09:00",
//       "location": "House Committee on Appropriations",
//       "description": "House Committee on Appropriations Public Hearing"
//     },
//     {
//       "type_id": 1,
//       "event_hash": "7357b16a",
//       "type": "Hearing",
//       "date": "2023-04-04",
//       "time": "09:00",
//       "location": "House Committee on Appropriations",
//       "description": "House Committee on Appropriations Executive Session"
//     }
//   ]
// },

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