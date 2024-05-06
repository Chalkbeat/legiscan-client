function swapEnum(obj) {
  var swapped = {};
  for (var k in obj) {
    var value = obj[k];
    swapped[value] = k * 1;
  }
  return swapped;
}

export const EVENT_TYPE = Object.fromEntries([
  [1,"Hearing"],
  [2,"Executive Session"],
  [3,"Markup Session"],
]);
export const EVENT_TYPE_VALUES = swapEnum(EVENT_TYPE);

export const PARTY = Object.fromEntries([
  [1,"Democrat"],
  [2,"Republican"],
  [3,"Independent"],
  [4,"Green Party"],
  [5,"Libertarian"],
  [6,"Nonpartisan"],
]);
export const PARTY_VALUES = swapEnum(PARTY);

export const PROGRESS = Object.fromEntries([
  [0,"Prefiled"],
  [1,"Introduced"],
  [2,"Engrossed"],
  [3,"Enrolled"],
  [4,"Passed"],
  [5,"Vetoed"],
  [6,"Failed"],
  [7,"Override"],
  [8,"Chaptered"],
  [9,"Refer"],
  [10,"Report Pass"],
  [11,"Report DNP"],
  [12,"Draft"],
]);
export const PROGRESS_VALUES = swapEnum(PROGRESS);

export const REASON = Object.fromEntries([
  [1,"NewBill"],
  [2,"StatusChange"],
  [3,"Chamber"],
  [4,"Complete"],
  [5,"Title"],
  [6,"Description"],
  [7,"CommRefer"],
  [8,"CommReport"],
  [9,"SponsorAdd"],
  [10,"SponsorRemove"],
  [11,"SponsorChange"],
  [12,"HistoryAdd"],
  [13,"HistoryRemove"],
  [14,"HistoryRevised"],
  [15,"HistoryMajor"],
  [16,"HistoryMinor"],
  [17,"SubjectAdd"],
  [18,"SubjectRemove"],
  [19,"SAST"],
  [20,"Text"],
  [21,"Amendment"],
  [22,"Supplement"],
  [23,"Vote"],
  [24,"Calendar"],
  [25,"Progress"],
  [26,"VoteUpdate"],
  [27,"TextUpdate"],
  [99,"ICBM"],
]);
export const REASON_VALUES = swapEnum(REASON);

export const ROLE = Object.fromEntries([
  [1, "Representative"],
  [2, "Senator"],
  [3, "Joint Conference"],
]);
export const ROLE_VALUES = swapEnum(ROLE);

export const SAST_TYPE = Object.fromEntries([
  [1,"Same As"],
  [2,"Similar To"],
  [3,"Replaced by"],
  [4,"Replaces"],
  [5,"Crossfiled"],
  [6,"Enabling for"],
  [7,"Enabled by"],
  [8,"Related"],
  [9,"Carry Over"],
]);
export const SAST_TYPE_VALUES = swapEnum(SAST_TYPE);

export const SPONSOR_TYPE = Object.fromEntries([
  [0,"Sponsor"],
  [1,"Primary Sponsor"],
  [2,"Co-Sponsor"],
  [3,"Joint Sponsor"],
]);
export const SPONSOR_TYPE_VALUES = swapEnum(SPONSOR_TYPE);

export const STANCE = Object.fromEntries([
  [0,"Watch"],
  [1,"Support"],
  [2,"Oppose"],
]);
export const STANCE_VALUES = swapEnum(STANCE);

export const SUPPLEMENT_TYPE = Object.fromEntries([
  [1,"Fiscal Note"],
  [2,"Analysis"],
  [3,"Fiscal Note/Analysis"],
  [4,"Vote Image"],
  [5,"Local Mandate"],
  [6,"Corrections Impact"],
  [7,"Misc"],
  [8,"Veto Letter"],
]);
export const SUPPLEMENT_TYPE_VALUES = swapEnum(SUPPLEMENT_TYPE);

export const TEXT_TYPE = Object.fromEntries([
  [1,"Introduced"],
  [2,"Comm Sub"],
  [3,"Amended"],
  [4,"Engrossed"],
  [5,"Enrolled"],
  [6,"Chaptered"],
  [7,"Fiscal Note"],
  [8,"Analysis"],
  [9,"Draft"],
  [10,"Conference Sub"],
  [11,"Prefiled"],
  [12,"Veto Message"],
  [13,"Veto Response"],
  [14,"Substitute"],
]);
export const TEXT_TYPE_VALUES = swapEnum(TEXT_TYPE);

export const BILL_TYPE = Object.fromEntries([
  [1,"Bill"],
  [2,"Resolution"],
  [3,"Concurrent Resolution"],
  [4,"Joint Resolution"],
  [5,"Joint Resolution Constitutional Amendment"],
  [6,"Executive Order"],
  [7,"Constitutional Amendment"],
  [8,"Memorial"],
  [9,"Claim"],
  [10,"Commendation"],
  [11,"Committee Study Request"],
  [12,"Joint Memorial"],
  [13,"Proclamation"],
  [14,"Study Request"],
  [15,"Address"],
  [16,"Concurrent Memorial"],
  [17,"Initiative"],
  [18,"Petition"],
  [19,"Study Bill"],
  [20,"Initiative Petition"],
  [21,"Repeal Bill"],
  [22,"Remonstration"],
  [23,"Committee Bill"],
]);
export const BILL_TYPE_VALUES = swapEnum(BILL_TYPE);

export const VOTE = Object.fromEntries([
  [1,"Yea"],
  [2,"Nay"],
  [3,"Not voting"],
  [4,"Absent"],
]);
export const VOTE_VALUES = swapEnum(VOTE);

export const STATE = Object.fromEntries([
  [1,  'AL'],
  [2,  'AK'],
  [3,  'AZ'],
  [4,  'AR'],
  [5,  'CA'],
  [6,  'CO'],
  [7,  'CT'],
  [8,  'DE'],
  [9,  'FL'],
  [10, 'GA'],
  [11, 'HI'],
  [12, 'ID'],
  [13, 'IL'],
  [14, 'IN'],
  [15, 'IA'],
  [16, 'KS'],
  [17, 'KY'],
  [18, 'LA'],
  [19, 'ME'],
  [20, 'MD'],
  [21, 'MA'],
  [22, 'MI'],
  [23, 'MN'],
  [24, 'MS'],
  [25, 'MO'],
  [26, 'MT'],
  [27, 'NE'],
  [28, 'NV'],
  [29, 'NH'],
  [30, 'NJ'],
  [31, 'NM'],
  [32, 'NY'],
  [33, 'NC'],
  [34, 'ND'],
  [35, 'OH'],
  [36, 'OK'],
  [37, 'OR'],
  [38, 'PA'],
  [39, 'RI'],
  [40, 'SC'],
  [41, 'SD'],
  [42, 'TN'],
  [43, 'TX'],
  [44, 'UT'],
  [45, 'VT'],
  [46, 'VA'],
  [47, 'WA'],
  [48, 'WV'],
  [49, 'WI'],
  [50, 'WY'],
  [51, 'DC'],
  [52, 'US'],
]);
export const STATE_VALUES = swapEnum(STATE);
