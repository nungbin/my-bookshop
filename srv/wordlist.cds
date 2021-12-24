using wordlist as wrd from '../db/wordlist';

service wordlistsrv {
    entity wordList as projection on wrd.wordlist;

    function getNoOfWords() returns Integer;
    function getWord(rowNum: Integer) returns String;
}