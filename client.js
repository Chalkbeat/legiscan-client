// API docs: https://legiscan.com/misc/LegiScan_API_User_Manual.pdf
import * as enums from "./enums.js";

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

    var response = await fetch(url.toString()).then(r => r.json());
    if (response.status == "ERROR") throw new Error(`Legiscan API rejected request: ${response.alert?.message || "no reason given"}`);
    return response;
  }

  /*
  Other API methods to stub out:
  - getSessionList(state)
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
   * Get a list of all bills for a given session or state
   * @param {Object} params - Either state or session ID must be specified
   * @param {string} [params.state] - US State, will return the current session
   * @param {string} [params.id] - the ID retrieved from getSessionList()
   * @returns {Object}
   */

  async getMasterList({ state, id }) {
    var result = await this.request("getMasterList", { state, id });
    var list = numericalToArray(result.masterlist);
    return list;
  }

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
   * @param {string} id - bill ID to request
   * @returns {Object}
   */
  async getBill(id) {
    var { bill } = await this.request("getBill", { id });
    if (!bill) {
      console.log("No details for ", id);
      return {};
    }
    // adjust flags to be human-readable
    for (var stage of bill.progress) {
      stage.event_id = stage.event;
      stage.event = enums.PROGRESS[stage.event_id];
    }
    bill.status_id = bill.status;
    bill.status = enums.PROGRESS[bill.status_id];
    for (var person of bill.sponsors) {
      person.sponsor_type = enums.SPONSOR_TYPE[person.sponsor_type_id];
    }
    return bill;
  }

  /**
   * Get the results of a search as a complete array containing all response pages
   * @param {string} query
   * @param {Object} [params] - Additional search parameters
   * @param {string} [params.state] - US state for this search
   * @param {number} [params.year] - Year specifier (available as static constants on LegiscanClient)
   * @returns {Object[]}
   */
  async getSearch(query, params = {}) {
    var all = [];
    for await (var result of this.getSearchAsync(query, params)) {
      all.push(result);
    }
    return all;
  }

  /**
   * Get the results of a search one at a time, as an async iterator
   * @param {string} query
   * @param {Object} [params] - Additional search parameters
   * @param {string} [params.state] - US state for this search
   * @param {number} [params.year] - Year specifier (available as static constants on LegiscanClient)
   * @yields {Object} Individual bill data
   */
  async *getSearchAsync(query, params = {}) {
    var page = 1;

    while (true) {

      var response = await this.request("getSearch", { query, page, ...params });
      var { summary } = response.searchresult;
      var items = numericalToArray(response.searchresult);

      for (var item of items) {
        // normalize ID strings
        item.bill_id = String(item.bill_id);
      }

      yield* items;

      page++;

      if (summary.page_total < page) return;

    }
  }

}
