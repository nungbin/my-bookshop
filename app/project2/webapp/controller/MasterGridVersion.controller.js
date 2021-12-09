sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"../Services/ServiceManager",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox"
], function(
	Controller,
	formatter,
	ServiceManager,
	JSONModel,
	MessageToast,
	Fragment,
	MessageBox
) {
	"use strict";
	var oStudentData = {},
      oResultData  = [],
      sSelectString;

	return Controller.extend("project2.project2.controller.Master", {
    formatter: formatter,

    onInit: function () {
      this._defaultODataModel = this.getOwnerComponent().getModel();
      this._categoryODataModel =
        this.getOwnerComponent().getModel("categoryModel");
      //Load JSON from a file
      this._UIControlJSONModel =
        this.getOwnerComponent().getModel("UIControlModel");
      this._UIControlJSONModel.setProperty("/visibleControl", false);
      //this.getView().setModel(this._bookJSONModel, "bookModel");

      // learned this from Vivek
      // at this point, Odata call isn't made yet since it's async.
      this._defaultODataModel
        .metadataLoaded()
        .then(this._onStudentMetadataLoaded.bind(this));
      this._categoryODataModel
        .metadataLoaded()
        .then(this._onCategoryMetadataLoaded.bind(this));

      this.getOwnerComponent()
        .getRouter()
        .getRoute("RouteRootView")
        .attachPatternMatched(this.objectMatched, this);
      ServiceManager.initJSONModel();
      oStudentData = {};
      sSelectString = "";
    },

    // this is triggered by, to ensure metadata gets loaded
    //		this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
    //		if call is not blocked by SSO which can occur with WebIDE.
    //		if call is blocked by SSO, _onMetadataLoaded will not be triggered at all. SSO needs to be turned off.
    _onCategoryMetadataLoaded: function () {
      // Fetching MetaModel from the OData model once metadata is loaded from
      //    this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
      var that = this;
      var oMetaData = this._categoryODataModel.getServiceMetadata(),
        // iterate through array. common technique used in Javascript
        oEntityType = oMetaData.dataServices.schema[0].entityType.filter(
          function (oItem) {
            let tempItemName = oItem.name;
            if (tempItemName.toUpperCase() === "BOOKS") {
              //Initialize a JSON model based on meta data
              that._bookJSONModel = new sap.ui.model.json.JSONModel({
                "": oItem.property,
              });
              that
                .getOwnerComponent()
                .setModel(that._bookJSONModel, "bookModel");
              //return oItem;
            }
          }
        );

      //_personJSON = Object.assign(_personJSON, obj);
      //oEntityType[0].property.forEach(element => {  _personJSON[element.name] = ""; });
    },

    _onStudentMetadataLoaded: function () {
      var that = this;
      var oMetaData = this._defaultODataModel.getServiceMetadata(),
        oEntityType = oMetaData.dataServices.schema[0].entityType.filter(
          function (oItem) {
            let tempItemName = oItem.name;
            if (tempItemName.toUpperCase() === "STUDENTS") {
              //Initialize a JSON model based on meta data
              let tStudentJSON = {};

              oItem.property.forEach((element) => {
                if (element.type.toUpperCase().includes("EDM.DATETIME")) {
                  tStudentJSON[element.name] = new Date();
                } else {
                  tStudentJSON[element.name] = "";
                }
              });
              that._studentJSONModel = new JSONModel(tStudentJSON);
              that
                .getOwnerComponent()
                .setModel(that._studentJSONModel, "studentModel");
              //return oItem;
            }
          }
        );
    },

    objectMatched: function (oEvent) {
      oStudentData = {};
      let bMainRefresh = this._UIControlJSONModel.getProperty("/mainRefresh");
      if (typeof bMainRefresh !== "undefined") {
        if (bMainRefresh) {
          this.getView().byId("smartFilterBar").search();
          this._UIControlJSONModel.setProperty("/mainRefresh", false);
        }
      }
    },

    onRowPress: function (oEvent) {
      let sPath = oEvent.getSource().getBindingContext().getPath();
      this._defaultODataModel.read(sPath, {
        success: function (data) {
          console.log(data);
        },
        error: function (error) {
          console.log(error);
        },
      });

      let eMail = oEvent.getSource().getBindingContext().getProperty("email");

      //learned from https://youtu.be/fTmn8Z6j2Ns?t=1838
      //var oTable = this.getView().byId("oTable");
      //var eMail  = oTable.getSelectedItem().getBindingContext().getProperty("email");
      this.getOwnerComponent().getRouter().navTo("detail", {
        email: eMail,
      });
      //oEvent.getParameter("listItem").getBindingContext().getProperty("email");
      //oEvent.getParameter("listItem").getBindingContext().getProperty("first_name");
    },

    onOpenCreateStudentDialog: function () {
      oStudentData = {};
      this._OpenCreateStudentDialog();
    },

    _OpenCreateStudentDialog: function () {
      let oView = this.getView();
      let that = this;

      // create the dialog lazily
      if (!this.byId("createStudent")) {
        //load asynchronous
        Fragment.load({
          id: oView.getId(),
          name: "project2.project2.view.CreateStudent",
          controller: this,
        }).then(function (oDialog) {
          // connect dialog to the root view of this component (models, lifecycle)
          oView.addDependent(oDialog);
          oDialog.open();
          that._setContextForCreateStudent();
        });
      } else {
        this.byId("createStudent").open();
        this._setContextForCreateStudent();
      }
    },

    _setContextForCreateStudent: function () {
      //learned from https://www.youtube.com/watch?v=AB1i1GGJMn4&t=2388s
      this._defaultODataModel.setDeferredGroups(["createStudent"]);
      this.getView().byId("createStudent").setModel(this._defaultODataModel);

      this._studentContext = this._defaultODataModel.createEntry("/Students", {
        groupId: "createStudent",
        properties: oStudentData,
        // properties: {
        // 	"email":        "3@gmail.com",
        // 	"first_name":   "first 3",
        // 	"last_name":    "last 3"
        // },
        success: function (oData) {
          console.log("Successful in creating a student entry!");
        },
        error: function (error) {
          console.log("Error in creating a student entry!");
        },
      });
      this._defaultODataModel.setDefaultBindingMode(
        sap.ui.model.BindingMode.TwoWay
      );
      this.getView()
        .byId("createStudent")
        .setBindingContext(this._studentContext);
    },

    onSaveStudentRecord: function () {
      // if (this.byId("iDCreateEmail").getValue() === "") {
      // 	MessageBox.error("Email can't be blank", {
      // 		icon:    MessageBox.Icon.ERROR,
      // 	})
      // }
      let sReturn = ServiceManager.validateEmailFormat(
        this.byId("iDCreateEmail").getValue()
      );
      if (sReturn !== "") {
        //set focus for a smart field
        //https://ui5.sap.com/1.60.11/#/api/sap.ui.core.Element/methods/focus
        this.getView().byId("iDCreateEmail").focus(this.byId("iDCreateEmail"));
        this._UIControlJSONModel.setProperty(
          "/emailValueState",
          sap.ui.core.ValueState.Error
        );
        this._UIControlJSONModel.setProperty("/emailValueStateText", sReturn);
      } else {
        this._defaultODataModel.submitChanges({
          groupId: "createStudent",
          success: function (oData) {
            //Whoever at SAP did the coding of this, putting statusCode into different structures based on results
            //   IS JUST ALL-TIME DUMB!!! so dumb to the freaking bones!!!
            //   Why can't the error handling be consistent with what ABAP is handling???
            if (typeof oData.__batchResponses[0].response !== "undefined") {
              if (
                typeof oData.__batchResponses[0].response.statusCode != "201"
              ) {
                //Convert JSON string to a JSON object
                //https://blogs.sap.com/2014/11/13/omodelread-jsonparse-jsonmodel/
                var oError = JSON.parse(
                  oData.__batchResponses[0].response.body
                );
                MessageBox.error(oError.error.message.value, {
                  icon: MessageBox.Icon.ERROR,
                });
              }
            } else {
              if (
                typeof oData.__batchResponses[0].__changeResponses[0] !==
                "undefined"
              ) {
                if (
                  oData.__batchResponses[0].__changeResponses[0].statusCode ===
                  "201"
                ) {
                  MessageBox.show(
                    "Student with email " +
                      oData.__batchResponses[0].__changeResponses[0].data
                        .email +
                      "has been created successfully!"
                  );
                  this.getView().byId("smartFilterBar").search();
                  this.getView().byId("createStudent").close();
                }
              }
            }
          }.bind(this),
          error: function (error) {
            console.log(error);
          },
        });
      }
    },

    onCancelStudentRecord: function () {
      if (this._defaultODataModel.hasPendingChanges()) {
        MessageBox.warning(
          "Your entries will be lost when you leave this page.",
          {
            icon: MessageBox.Icon.WARNING,
            actions: ["Leave Page", MessageBox.Action.CLOSE],
            emphasizeAction: "Leave Page",
            onClose: function (sAction) {
              if (sAction == "Leave Page") {
                this._defaultODataModel.deleteCreatedEntry(
                  this._studentContext
                );
                this._defaultODataModel.refresh();
                this.getView().byId("createStudent").close();
              }
            }.bind(this),
          }
        );
      }
    },

    onCreateEmailChanged: function (oEvent) {
      let inValue = oEvent.getSource().getValue();
      let sReturn = ServiceManager.validateEmailFormat(inValue);
      if (sReturn !== "") {
        //https://sapui5.hana.ondemand.com/sdk/#/api/sap.ui.core.ValueState%23properties
        this._UIControlJSONModel.setProperty(
          "/emailValueState",
          sap.ui.core.ValueState.Error
        );
        this._UIControlJSONModel.setProperty("/emailValueStateText", sReturn);
      }
    },

    onClone: function (oEvent) {
      let tmpData = oEvent.getSource().getBindingContext().getObject();
      ServiceManager.prepareStudentData(tmpData, oStudentData);
      oStudentData.email = ""; //clear email
      this._OpenCreateStudentDialog();
    },


    onBeforeRebind: function (oEvent) {
      // set preventTableBind to 'true' will prevent smart table to search
      //oEvent.getParameters().bindingParams.preventTableBind = true;

      this.addBindingListener(oEvent.getParameters().bindingParams, 
                  "dataReceived", 
                  this._onBindingDataReceivedListener.bind(this));

      this.addBindingListener(oEvent.getParameters().bindingParams, 
                  "dataRequested", 
                  this._onBindingDataRequestedListener.bind(this));
    },


	// good learning from 
	//   https://blogs.sap.com/2019/11/04/handle-datareceived-event-in-smart-table-after-version-1.56-in-sapui5/
    addBindingListener: function (oBindingInfo, sEventName, fHandler) {
      oBindingInfo.events = oBindingInfo.events || {};

      if (!oBindingInfo.events[sEventName]) {
        oBindingInfo.events[sEventName] = fHandler;
      } else {
        // Wrap the event handler of the other party to add our handler.
        var fOriginalHandler = oBindingInfo.events[sEventName];
        oBindingInfo.events[sEventName] = function () {
          fHandler.apply(this, arguments);
          fOriginalHandler.apply(this, arguments);
        };
      }
    },


    // receive data from smart table after hitting 'go' button
    _onBindingDataReceivedListener: function(oEvent) {
      // oEvent.getParameter('data'):  to get result
      // var itemCount = oEvent.getParameter('data')['results'].length;
      oResultData = oEvent.getParameter('data')['results'];
    },


    _onBindingDataRequestedListener: function(oEvent) {
      //this event gets triggered first before DataReceived event
      console.log(sSelectString);
      sSelectString = oEvent.getSource().mParameters.select;
    },


    // thanks to https://blogs.sap.com/2016/11/23/pdf-download-option-with-sapui5/
    onDownloadPDF: function() {
      if (sSelectString === "") {
        MessageToast.show("There is no data to export to PDF!")     
      }
      else if (oResultData.length === 0) {
        MessageToast.show("There is no data to export to PDF!")     
      }else {
        var arrayString = sSelectString.split(',');
        var data = [];

        for (var i=0 ; i < oResultData.length ; i++) {
          data[i] = [];
          for (var j=0 ; j < arrayString.length ; j++) {
            let tlabel  = arrayString[j];
            let tLabel2 = tlabel.split("/");
            let tValue;
            if (tLabel2.length > 1) {
              tValue = oResultData[i][tLabel2[0]][tLabel2[1]];
            }
            else {
              tValue = oResultData[i][tlabel];
            }
            if (tValue instanceof Date){
              // Convert date to locale format
              tValue = tValue.toLocaleDateString();
            }
            data[i].push(tValue);
          } 
        }

        // data[0] = [1,2,3,4,5];
        var doc = new jsPDF('p', 'pt');
        doc.autoTable(arrayString, data);
        doc.save("StudentScoreResults.pdf");  
      }
    },


    onAfterVariantApply: function(oEvent) {
      debugger;
    },

    onSFBInitialise: function (oEvent) {},

    onSearch: function (oEvent) {},

    // onCloseCreateStudentDialog: function() {
    // 	this.byId("createStudent").close();
    // }
  });
});