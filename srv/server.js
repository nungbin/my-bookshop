const cds = require("@sap/cds");
const proxy = require("@sap/cds-odata-v2-adapter-proxy");

cds.on("bootstrap", (app) => {
    // https://www.npmjs.com/package/@sap/cds-odata-v2-adapter-proxy
    app.use(proxy({caseInsensitive: true}));
});

module.exports = cds.server;
