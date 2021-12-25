const cds = require("@sap/cds");


function _getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function _getNoOfWords(req) {
  const service = await cds.connect.to('db');
  const txService = service.tx(req);
  const sql = "select Count(1) from 'wordlist_wordlist'";

  try {
    const noOfWords = await txService.run(sql);
    return noOfWords;
  }
  catch (error) {
    //some errors
    console.log(error);
  }  
}

async function _getWord(req, rowNum) {
  const service = await cds.connect.to('db');
  const txService = service.tx(req);
  const sql = "SELECT word FROM (" + 
              "  SELECT " +
              "    ROW_NUMBER() OVER ( " +
              "      ORDER BY word " +
              "    ) RowNum, " +
              "    word " +
              "  FROM " +
              "    'wordlist_wordlist' " +
              "  Order by word " +
              ")" +
              "where RowNum = " + rowNum;

  try {
    const word = await txService.run(sql);
    return word[0].word;
  }
  catch (error) {
    //some errors
    console.log(error);
  }
}


async function _pickRandomWord(req, noOfWords) {
  const word = await _getWord(req, _getRandomInt(noOfWords));
  return word;
}


const wordListSrvImplementation = async function (srv) {
    var _pickedWord,
        _noOfWords,
        _totalCount,
        _encryptedArray,
        _tries,
        _incorrectCounter;

    srv.on("initGame", () => {
      _pickedWord = "";
      _noOfWords = 0;
      _incorrectCounter = 0;
      _totalCount = 7;
      _tries = 0;
      _encryptedArray = "";
      return true;
    });


    //http://localhost:4004/wordlistsrv/getNoOfWords()
    srv.on("getNoOfWords", async req => {
      let response = await _getNoOfWords(req);
      if (typeof response != 'undefined') {
        if (response[0]["Count(1)"] > 0) {
          _noOfWords = response[0]["Count(1)"];
          console.log("No of words: ", _noOfWords);
          return true;
        }
      }
      return false;
    });


    srv.on("pickRandomWord", async req => {
      if (_noOfWords > 0) {
        _pickedWord = await _pickRandomWord(req, _noOfWords);
        if (_pickedWord === "") {
          console.log("picked word: ", _pickedWord);
          return false;
        }
        else {
          console.log("picked word: ", _pickedWord);
          return true;
        }  
      }
      console.log("picked word: ", _pickedWord);
      return false;
    });

    srv.on("returnChosenWord", () => {
      console.log("picked word: ", _pickedWord);
      let encryptedArray = _pickedWord.split('');
      encryptedArray = encryptedArray.map(e => '_');
      _encryptedArray = encryptedArray;
      encryptedArray = encryptedArray.join(' ');
      console.log("encrypted word: ", encryptedArray.toString());
      return encryptedArray.toString();
    });

    srv.on("compareWords", (req) => {
      let matched = false;
      const { enteredWord } = req.data;
      const response = {};

      console.log(enteredWord);
      let originalArray = _pickedWord.split('');
      if (originalArray.includes(enteredWord)) {
        matched = true;
        for (let i=0 ; i<originalArray.length ; i++) {
          if (_encryptedArray[i] === '_') {
            if (originalArray[i].toLowerCase() === enteredWord.toLowerCase()) {
              _encryptedArray[i] = originalArray[i];
            }
          }
        }  
      }
      if (!_encryptedArray.includes('_')) {
        response.won          = true;
        response.gameOver     = false;
        response.originalWord = _pickedWord;
      }
      else {
        response.won            = false;
        if (matched === false) {
          _incorrectCounter++;          
          response.gameOver     = false;
          response.originalWord = '';
          if (_incorrectCounter >= _totalCount) {
            response.gameOver     = true;
            response.originalWord = _pickedWord;
          }
        }
      }
      response.incorrectCounter = _incorrectCounter;
      response.encryptedArray   = _encryptedArray.join(' ');
      console.log(response);

      return response;
    });

    //http://localhost:4004/wordlistsrv/getWord(rowNum=3)
    srv.on("getWord", async req => {
      const { rowNum } = req.data;

      const service = await cds.connect.to('db');
      const txService = service.tx(req);
      const sql = "SELECT word FROM (" + 
                  "  SELECT " +
                  "    ROW_NUMBER() OVER ( " +
                  "      ORDER BY word " +
                  "    ) RowNum, " +
                  "    word " +
                  "  FROM " +
                  "    'wordlist_wordlist' " +
                  "  Order by word " +
                  ")" +
                  "where RowNum = " + rowNum;
  
      try {
        const word = await txService.run(sql);
        return word;
      }
      catch (error) {
        //some errors
        console.log(error);
      }
    });
  }

module.exports = wordListSrvImplementation;