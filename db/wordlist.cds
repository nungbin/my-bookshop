using { managed } from '@sap/cds/common';

namespace wordlist;

entity wordlist : managed {
    key word:  String(80);
}