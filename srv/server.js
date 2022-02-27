const cds = require("@sap/cds");
const proxy = require("@sap/cds-odata-v2-adapter-proxy");
const cors = require('cors');

cds.on("bootstrap", (app) => {
    // credit: https://answers.sap.com/questions/13204538/cap-angular-cors-block-on-cap-service.html
    //   to allow CORS, it's setup on the server side, same as how it's setup in SICF in SAP.
    //console.debug("Use: cors middleware");
    console.log("Use: cors middleware");
    app.use(cors());    
    
    // https://www.npmjs.com/package/@sap/cds-odata-v2-adapter-proxy
    app.use(proxy({caseInsensitive: true}));
});

module.exports = cds.server;
