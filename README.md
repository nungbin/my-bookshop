# Getting Started

Welcome to your new project.

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`package.json` | project metadata and configuration
`readme.md` | this getting started guide


## Next Steps

- `npm install` to install required modules based on package.json.
- `npm install @sap/cds-odata-v2-adapter-proxy -s` to install the oData v2 proxy. This is needed for smart controls to work properly.
- `npm install sapui5-sdk` to install SAPUI5 SDK, optionally needed for 'project2' to work locally if index.html is using the cahced CDN. In the case of this, using the local cached CDN, create a symbolic link for the resources folder so index.html is able to load the UI5 framework. Or make a change in index.html to access the global CDN (https://ui5.sap.com/resources/sap-ui-core.js).
- Open a new terminal and run `cds watch` or `cds run`.
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start adding content, for example, a [db/schema.cds](db/schema.cds).
- practice on the Student Learning Management System


## Learn More

Learn more at https://cap.cloud.sap/docs/get-started/.
