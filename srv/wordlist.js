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
    var pickedWord,
        noOfWords,
        counter;

    srv.on("initGame", () => {
      pickedWord = "";
      noOfWords = 0;
      counter = 0;
      return true;
    });


    //http://localhost:4004/wordlistsrv/getNoOfWords()
    srv.on("getNoOfWords", async req => {
      let response = await _getNoOfWords(req);
      if (typeof response != 'undefined') {
        if (response[0]["Count(1)"] > 0) {
          noOfWords = response[0]["Count(1)"];
          console.log("No of words: ", noOfWords);
          return true;
        }
      }
      return false;
    });


    srv.on("pickRandomWord", async req => {
      if (noOfWords > 0) {
        pickedWord = await _pickRandomWord(req, noOfWords);
        if (pickedWord === "") {
          console.log("picked word: ", pickedWord);
          return false;
        }
        else {
          console.log("picked word: ", pickedWord);
          return true;
        }  
      }
      console.log("picked word: ", pickedWord);
      return false;
    });

    srv.on("returnChosenWord", () => {
      console.log("picked word: ", pickedWord);
      let encryptedArray = pickedWord.split('');
      encryptedArray = encryptedArray.map(e => '_');
      encryptedArray = encryptedArray.join(' ');
      console.log("encrypted word: ", encryptedArray.toString());
      return encryptedArray.toString();
    });

    srv.on("compareWords", (req) => {
      const { enteredWord } = req.data;
      console.log(enteredWord);
      return enteredWord;
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