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
    return word;
  }
  catch (error) {
    //some errors
    console.log(error);
  }
}


const wordListSrvImplementation = async function (srv) {
    var pickedWord="",
        counter=0;

    srv.on("initGame", () => {
      pickedWord = "";
      return true;
    });


    //http://localhost:4004/wordlistsrv/getNoOfWords()
    srv.on("getNoOfWords", async req => {
      //const noOfWords = await _getNoOfWords(req);
      //return noOfWords;
      //console.log(_getRandomInt(noOfWords[0]["Count(1)"]));
      return true;
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

    srv.on("pickRandomWord", async req => {
      const noOfWords = await _getNoOfWords(req);
      const word = await _getWord(req, _getRandomInt(noOfWords[0]["Count(1)"]));

      pickedWord = word;
      return true;
    });

    srv.on("returnChosenWord", () => {
      return pickedWord;
    });

    srv.on("compareWords", (req) => {
      const { enteredWord } = req.data;
      return enteredWord;
    })
}

module.exports = wordListSrvImplementation;