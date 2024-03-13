// utils
var pause = (time = 1000) => new Promise(ok => setTimeout(ok, time));
var fetchJSON = url => fetch(url).then(r => r.json());

export class LegiscanClient {
  static CURRENT_YEAR = 2;

  static INTRODUCED = 1;
  static ENGROSSED = 2;
  static ENROLLED = 3;
  static PASSED = 4;
  static VETOED = 5;
  static FAILED = 6;

  constructor(key = process.env.LEGISCAN_API_KEY) {
    this.key = key;
  }

  async request(op, params = {}) {
    var url = new URL("https://api.legiscan.com/");
    url.search = new URLSearchParams({
      op,
      key: this.key,
      ...params
    }).toString();

    return fetch(url.toString()).then(r => r.json());
  }

  async getText(id) {
    return this.request("getBillText", { id });
  }

  async getDetails(id) {
    var raw = await this.request("getBill", { id });
    return raw.bill || {};
  }

  async getSearch(query, detailed = true, state = "", year = LegiscanClient.CURRENT_YEAR) {
    var page = 1;

    var all = [];

    // TODO: find a nicer way to do this, maybe with recursion?
    while (true) {

      var response = await this.request("getSearch", { query, state, year, page });
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
        await Promise.all(items.map(async item => {
          var details = await this.getDetails(item.bill_id);
          Object.assign(item, details);
        }));
      }

      all.push(...items);

      page++;

      if (summary.page_total <= page) break;

    }

    return all;
  }

}
