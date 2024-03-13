# Requirements

* node
* better-sqlite3
* legiscan API key

# Running the project

`node .` runs `index.js`, which interfaces with `sql.js`.

The [Legiscan API documentation](https://legiscan.com/gaits/documentation/legiscan) is very robust, but [Investigate.ai has easier-to-parse resources](https://investigate.ai/azcentral-text-reuse-model-legislation/01-downloading-one-million-pieces-of-legislation-from-legiscan/).

# Useful codes

BILL_STATUS = {1: "Introduced",
               2: "Engrossed",
               3: "Enrolled",
               4: "Passed",
               5: "Vetoed",
               6: "Failed/Dead"}

BILL_PROGRESS = {1: "Introduced",
                 2: "Engrossed",
                 3: "Enrolled",
                 4: "Passed",
                 5: "Vetoed",
                 6: "Failed/Dead",
                 7: "Veto Override",
                 8: "Chapter/Act/Statute",
                 9: "Committee Referral",
                10: "Committee Report Pass",
                11: "Committee Report DNP"}

STATES = ['ak', 'al', 'ar', 'az', 'ca', 'co', 'ct', 'dc', 'de', 'fl', 'ga',
          'hi', 'ia', 'id', 'il', 'in', 'ks', 'ky', 'la', 'ma', 'md', 'me',
          'mi', 'mn', 'mo', 'ms', 'mt', 'nc', 'nd', 'ne', 'nh', 'nj', 'nm',
          'nv', 'ny', 'oh', 'ok', 'or', 'pa', 'ri', 'sc', 'sd', 'tn', 'tx',
          'ut', 'va', 'vt', 'wa', 'wi', 'wv', 'wy']