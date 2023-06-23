// import fetch from 'node-fetch';
// var { writeCSV } = require("./local");
// var { uploadSheet } = require("./upload");

var apiKeys = {
  legiscan_key: process.env.LEGISCAN_API_KEY
}

// utils
var pause = (time = 1000) => new Promise(ok => setTimeout(ok, time));
var fetchJSON = url => fetch(url).then(r => r.json());

// search term that fills in flex words within base query 
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

// var scrapeBillText = async function(bill) {

//   if (bill.texts) {
//     id = bill.texts.at(-1).doc_id; // gets ID for most recent revision in bill text
//     url = bill.texts.at(-1).url;
//     console.log(id, url);
//   };

// };

async function main() {

  var collected = [];
  var collectedDetails = [];

  for (var q of queries) {
    var query = `school AND "${q}" NOT "medical school"`;
    var { all } = await getBillList(query, "tx");
    for (var item of all) {
      item.searchTerm = q;
    }
    collected.push(...all);
  }

  // console.log(collected);
  
  var billIds = new Set(collected.map(c => c.bill_id));

  for (let billId of billIds) {

    var billDetails = await getBillDetails(billId);

    if (billDetails) {
      collectedDetails.push(billDetails);
    }
  };

  // console.log(collectedDetails);

  var passedBillIds = new Set(collectedDetails.map(c => c.bill_id));

  console.log(passedBillIds);

  // var collectedPassedBills = collected.filter(c => passedBillIds.includes(c.bill_id));

  // console.log(collectedPassedBills);

  // map billId to metadata
  // array of objects for billId, query, relevancy

}

main();

// create array of relevance score : search term, keep single results