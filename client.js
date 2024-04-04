// API docs: https://legiscan.com/misc/LegiScan_API_User_Manual.pdf

// utils
var pause = (time = 1000) => new Promise(ok => setTimeout(ok, time));
var fetchJSON = url => fetch(url).then(r => r.json());
var parallel = (items, callback) => Promise.all(items.map(callback));

// object handling for numeric keys
function* numericalEntries(object) {
  for (var k in object) {
    if (k.match(/^\d+$/)) {
      yield [k * 1, object[k]];
    }
  }
}

function numericalToArray(object) {
  return Array.from(numericalEntries(object), entry => entry[1]);
}

/**
 * Class to instantiate a client for the Legiscan API
 */
export class LegiscanClient {
  static ALL_YEARS = 1;
  static CURRENT_YEAR = 2;
  static RECENT = 3;
  static PRIOR_YEAR = 4;

  static INTRODUCED = 1;
  static ENGROSSED = 2;
  static ENROLLED = 3;
  static PASSED = 4;
  static VETOED = 5;
  static FAILED = 6;

  /**
   * @param {string} key - the key for the API, defaults to your $LEGISCAN_API_KEY env variable
   */
  constructor(key = process.env.LEGISCAN_API_KEY) {
    this.key = key;
  }

  /**
   * Make an API request, adding the key automatically
   * @param {string} op - The API endpoint to hit (e.g., getSearchRaw)
   * @param {Object} params - Query parameters to add to the request URL
   */
  async request(op, params = {}) {
    var url = new URL("https://api.legiscan.com/");
    url.search = new URLSearchParams({
      op,
      key: this.key,
      ...params
    }).toString();

    return fetch(url.toString()).then(r => r.json());
  }

  /*
  Other API methods to stub out:
  - getSessionList(state)
  - getMasterList({ id || state })
  - getMasterListRaw({ id || state? })
  - getAmendment(id)
  - getSupplement(id)
  - getRollCall(id)
  - getPerson(id)
  - getSearchRaw(query, { state?, year?, id? })
  - getDatasetList({ state?, year? })
  - getDataset(id, key)
  - getSessionPeople(id)
  - getSponsoredList(id)
  - getMonitorList(record?)
  - getMonitorListRaw(record?)
  - setMonitor(list, action, stance?)
  */

  /**
   * Get the full text of a bill
   * @param {string} id - bill ID to request
   * @returns {Object}
   */
  async getBillText(id) {
    return this.request("getBillText", { id });
  }

  /**
   * Get the details for a bill (such as status or history)
   * @async
   * @param {string} id - bill ID to request
   * @returns {Object}
   */
  async getBill(id) {
    var raw = await this.request("getBill", { id });
    if (!raw.bill) console.log("No details for ", id);
    return raw.bill || {};
  }

  /**
   * Get an entire session by state
   * @async
   * @param {string} [params.state] - US state for this search
   * @returns {Object}
   */
  async getMasterList(params) {
    var response = await this.request("getMasterList", params);
    var list = numericalToArray(response.masterlist);
    return list;
  }

  /**
   * Get the results of a search as a complete array containing all response pages
   * @param {string} query
   * @param {boolean} [detailed=true] - Should this also get bill details?
   * @param {Object} [params] - Additional search parameters
   * @param {string} [params.state] - US state for this search
   * @param {number} [params.year] - Year specifier (available as static constants on LegiscanClient)
   * @returns {Object[]}
   */
  async getSearch(query, detailed = true, params = {}) {
    var all = [];
    for await (var result of this.getSearchAsync(query, detailed, params)) {
      all.push(result);
    }
    return all;
  }

  /**
   * Get the results of a search one at a time, as an async iterator
   * @param {string} query
   * @param {boolean} [detailed=true] - Should this also get bill details?
   * @param {Object} [params] - Additional search parameters
   * @param {string} [params.state] - US state for this search
   * @param {number} [params.year] - Year specifier (available as static constants on LegiscanClient)
   * @yields {Object} Individual bill data
   */
  async *getSearchAsync(query, detailed = true, params = {}) {
    var page = 1;

    var all = [];

    while (true) {

      var response = await this.request("getSearch", { query, page, ...params });
      var { summary } = response.searchresult;
      
      const keys = Object.keys(response.searchresult);
      const billKeys = keys.filter(d => d.match(/^\d+$/)); // store numeric keys to remove summary and status

      var items = billKeys.map(k => response.searchresult[k]);
      for (var item of items) {
        // normalize ID strings
        item.bill_id = String(item.bill_id);
      }

      // if requested, get and merge in detail information
      if (detailed) {
        await parallel(items, async b => Object.assign(b, await this.getBill(b.bill_id)));
      }

      yield* items;

      page++;

      if (summary.page_total < page) return;

    }
  }

}
