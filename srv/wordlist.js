const cds = require("@sap/cds");

const wordListSrvImplementation = async function (srv) {
    //http://localhost:4004/wordlistsrv/getNoOfWords()
    srv.on("getNoOfWords", async req => {
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