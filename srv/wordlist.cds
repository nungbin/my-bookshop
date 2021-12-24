using wordlist as wrd from '../db/wordlist';

service wordlistsrv {
    entity wordList as projection on wrd.wordlist;

    function initGame() returns Boolean;

    function getNoOfWords() returns Boolean;

    function getWord(rowNum: Integer) returns String;

    function pickRandomWord() returns Boolean;

    function returnChosenWord() returns String;

    function compareWords(enteredWord: String) returns Boolean;
}