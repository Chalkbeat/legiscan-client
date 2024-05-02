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

export function numericalToArray(object) {
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
  - getSearchRaw(query, { state?, year?, id? })
  - getDatasetList({ state?, year? })
  - getDataset(id, key)
  - getMonitorList(record?)
  - getMonitorListRaw(record?)
  - setMonitor(list, action, stance?)
  */

  /**
   * Get a list of sessions for a state
   * @param {string} [state] - The US state, or all states if omitted
   * @returns {Object}
   */

  async getSessionList(state) {
    var result = await this.request("getSessionList", { state });
    for (var session of result.sessions) {
      session.state = enums.STATE[session.state_id];
    }
    return result.sessions;
  }

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
    for (var item of list) {
      item.status_id = item.status;
      item.status = enums.PROGRESS[item.status_id];
    }
    return list;
  }

  /**
   * Get the full text of a bill
   * @param {number} id - bill ID to request
   * @returns {Object}
   */
  async getBillText(id) {
    var response = await this.request("getBillText", { id });
    return response.text;
  }

  /**
   * Get the details for a bill (such as status or history)
   * @param {number} id - bill ID to request
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
   * Get the text of an amendment
   * @param {number} id - amendment ID number (probably from getBill)
   * @returns {Object}
   */

  async getAmendment(id) {
    var { amendment } = await this.request("getAmendment", { id });
    return amendment;
  }

  /**
   * Get the text of a supplement (such as a fiscal note or analysis)
   * @param {number} id - supplement ID number (probably from getBill)
   * @returns {Object}
   */

  async getSupplement(id) {
    var { supplement } = await this.request("getSupplement", { id });
    return supplement;
  }

  /**
   * Get the details of a roll call vote
   * @param {number} id - vote ID number
   * @returns {Object}
   */

  async getRollCall(id) {
    var result = await this.request("getRollCall", { id });
    var vote = result.roll_call;
    return vote;
  }

  /**
   * Get details on a person by ID
   * @param {number} id - The Legiscan person ID
   * @returns {Object}
   */

  async getPerson(id) {
    var { person } = await this.request("getPerson", { id });
    person.state = enums.STATE[person.state_id];
    return person;
  }

  /**
   * Get all active people in a given legislative session
   * @param {number} id - The Legiscan session ID
   * @returns {Array}
   */

  async getSessionPeople(id) {
    var response = await this.request("getSessionPeople", { id });
    var people = response.sessionpeople.people;
    for (var person of people) {
      person.state = enums.STATE[person.state_id];
    }
    return people;
  }

  /**
   * Get a list of bills sponsored by a specific person
   * @param {number} id - Legiscan person ID for the sponsor
   * @returns {Array}
   */

  async getSponsoredList(id) {
    var response = await this.request("getSponsoredList", { id });
    var { sessions, bills } = response.sponsoredbills;
    sessions = Object.fromEntries(sessions.map(s => [s.session_id, s.session_name]));
    for (var bill of bills) {
      bill.session = sessions[bill.session_id];
    }
    return bills;
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

      yield* items;

      page++;

      if (summary.page_total < page) return;

    }
  }

}
