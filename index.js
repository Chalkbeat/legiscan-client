// import fetch from 'node-fetch';
// var { writeCSV } = require("./local");
// var { uploadSheet } = require("./upload");

var apiKeys = {
  legiscan_key: process.env.LEGISCAN_API_KEY
}

// utils
var pause = (time = 1000) => new Promise(ok => setTimeout(ok, time));
var fetchJSON = url => fetch(url).then(r => r.json());

// var state = 'tx'
// var year = 2

var queries = [
  "gender",
  "transgender",
  "sexual orientation",
  "homosexual",
  "homosexuality",
  "parental rights",
  "gender identity",
  "gender transition"
]

// Runs LegiScan built-in full-text search method
// search
// I usually set up an array to hold the results, and then I do "get page X, push results into the array, get page X + 1, push results" until I run out of pages. Then I can look at the array.
// resultAccumulator.push(...response.results)
 
var getBillList = async function(query, state = "ALL", year = 2, page = 1) {

  var url = new URL("https://api.legiscan.com/");
  url.search = new URLSearchParams({
    query, state, year, key: apiKeys.legiscan_key, op: "getSearch"
  }).toString();

  var all = [];

  do {

    url.searchParams.set("page", page);

    var bills = await fetchJSON(url.toString());
    var { summary } = bills.searchresult;
    
    const keys = Object.keys(bills.searchresult);
    const billKeys = keys.filter(d => d.match(/^\d+$/)); // store numeric keys to remove summary and status

    var items = billKeys.map(k => bills.searchresult[k]);
    all.push(...items);

    console.log(bills.searchresult.summary);
    page++;

  } while (bills.searchresult.summary.page_total > bills.searchresult.summary.page_current * 1);

  return { all, query };

};

var getBillDetails = async function(id) {

  var url = new URL("https://api.legiscan.com/");
  url.search = new URLSearchParams({
    id, key: apiKeys.legiscan_key, op: "getBill"
  }).toString();

  var billRaw = await fetchJSON(url.toString());

  var statusCodes = [3,4]; // filters for enrolled and passed bills

  if (statusCodes.includes(billRaw.bill.status)) {
    var bill = billRaw.bill;
    return bill;
  };

};

var getBillText = async function(bill) {

  if (bill.texts) {
    id = bill.texts.at(-1).doc_id; // gets ID for most recent revision in bill text

    console.log(id);
  };

  var url = new URL("https://api.legiscan.com/");
  url.search = new URLSearchParams({
    id, key: apiKeys.legiscan_key, op: "getBillText"
  }).toString();

  console.log(url);

  var billText = await fetchJSON(url.toString());

  console.log(billText);

  return billText;

};

var scrapeBillText = async function(bill) {

  if (bill.texts) {
    id = bill.texts.at(-1).doc_id; // gets ID for most recent revision in bill text
    url = bill.texts.at(-1).url;
    console.log(id, url);
  };

};

async function main() {

  var collected = [];
  var collectedDetails = [];

  for (var q of queries) {
    var query = `school AND "${q}" NOT "medical school"`;
    var { all } = await getBillList(query);
    for (var item of all) {
      item.searchTerm = q;
    }
    collected.push(...all);
  }
  
  var billIds = new Set(collected.map(c => c.bill_id));

  for (let billId of billIds) {

    var billDetails = await getBillDetails(billId);

    if (billDetails) {
      collectedDetails.push(billDetails);
    }
  };

  for (let bill of collectedDetails) {
    var billText = await scrapeBillText(bill);
  }

  // map billId to metadata
  // array of objects for billId, query, relevancy

  // console.log(collectedDetails);

}

main();

// create array of relevance score : search term, keep single results


// getBillList(query, "tx")//.then(results => console.log(results));

/*
  Get a page of results for a search against the LegiScan full text engine; returns a NON-paginated result set with simplified details.
  Specify a bill number or a query string.  Year can be an exact year
  or a number between 1 and 4, inclusive.  These integers have the
  following meanings:
      1 = all years
      2 = current year, the default
      3 = recent years
      4 = prior years
*/

// async search({ state = 'ALL', year = 2, query = null }) {
//   const { BASE_URL } = this;
//   const queryString = `&op=getSearch&state=${state}&query=${query}&year=${year}`;
//   const url = BASE_URL + queryString;

//   try {
//     const response = await axios.get(url);
//     const searchReults = response.data.searchresult;

//     if (!searchReults) {
//       console.log('No search results?', response.data);
//       return [];
//     }

    // const keys = Object.keys(searchReults);
    // const billKeys = keys.filter(d => d.match(/^\d+$/)); // store numeric keys

//     // Check if there are bills that exist in this query
//     if (billKeys === []) return [];

//     const withSearthTerm = billKeys.map((key) => {
//       const bill = searchReults[key];
//       bill.query = query;
//       return bill;
//     });

//     return withSearthTerm;
//   } catch (e) {
//     console.error('🚨Search error:', state, query, year);
//   }
// }

// async getBillText(docId) {
//   const { BASE_URL } = this;
//   const queryString = `&op=getBillText&id=${docId}`;
//   const url = BASE_URL + queryString;

//   try {
//     const response = await axios.get(url);
//     const docInfo = response.data.text;
//     return docInfo;
//   } catch (e) {
//     console.error('🚨getBillText error:', docId, e.code);
//     return null;
//   }
// }
// }