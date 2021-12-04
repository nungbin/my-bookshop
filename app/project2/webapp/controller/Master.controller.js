sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function(
	Controller,
	formatter,
	JSONModel,
	MessageToast
) {
	"use strict";

	return Controller.extend("project2.project2.controller.Master", {
		formatter: formatter,
		
        onInit: function () {
            this._defaultODataModel  = this.getOwnerComponent().getModel();
			this._categoryODataModel = this.getOwnerComponent().getModel("categoryModel");
			//Load JSON from a file
			this._UIControlJSONModel = this.getOwnerComponent().getModel("UIControlModel");
			this._UIControlJSONModel.setProperty("/visibleControl", false)
			//this.getView().setModel(this._bookJSONModel, "bookModel");

			// learned this from Vivek
			// at this point, Odata call isn't made yet since it's async.
			this._categoryODataModel.metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},

		// this is triggered by, to ensure metadata gets loaded
		//		this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		//		if call is not blocked by SSO which can occur with WebIDE.
		//		if call is blocked by SSO, _onMetadataLoaded will not be triggered at all. SSO needs to be turned off.
		_onMetadataLoaded: function () {
			// Fetching MetaModel from the OData model once metadata is loaded from 
			//    this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			var oMetaData = this._categoryODataModel.getServiceMetadata(),
				// iterate through array. common technique used in Javascript
				oEntityType = oMetaData.dataServices.schema[0].entityType.filter(function (oItem) {
					let tempItemName = '';
					tempItemName = oItem.name;
					if (tempItemName.toUpperCase() === "BOOKS") {
						return oItem;
					}
				});

				//_personJSON = Object.assign(_personJSON, obj);	
				//oEntityType[0].property.forEach(element => {  _personJSON[element.name] = ""; });

				//Initialize a JSON model based on meta data
				this._bookJSONModel = new sap.ui.model.json.JSONModel({
  				  "": oEntityType[0].property
				});
				this.getOwnerComponent().setModel(this._bookJSONModel, "bookModel")
		},	

        onClick: function (oEvent) {
            var sPath = "/Books";
            var that = this;

			this._categoryODataModel.read(sPath, {
				success: function (oModelData, oResponse) {
					//oData.BIC = oModelData.BIC;
					//oData.IBAN_CLABE_OTHERS = oModelData.IBAN_CLABE_OTHERS;
					//that.getView().getModel("trainingModel").setData(oData);  //refresh data on the screen

					if ( oModelData.results.length >= 1 ) {
						// let oData = that.getView().getModel("bookModel").getData();
						// //Below statement acts similar to ABAP's MOVE-CORRESPONDING
						// oData = Object.assign(oData, oModelData.results[0]);
						// that.getView().getModel("bookModel").setData(oData);
						// //Bind result to the simple form
						// that.getView().byId("sfBooks").bindElement({ path: "/", model: "bookModel" });

						// let oData = that._bookJSONModel.getData();
						// //Below statement acts similar to ABAP's MOVE-CORRESPONDING
						// oData = Object.assign(oData, oModelData.results[0]);
						that._bookJSONModel.setData(oModelData.results[0]);

						// //Bind result to the simple form
						that.getView().byId("sfBooks").bindElement({ path: "/", model: "bookModel" });
					}
				},
				error: function (oError) {
					MessageToast.show(that.getBundle().getText("MasterController.ERRORUnableToRetrieveABook"));
				}
			});            
        },

		onClickCallMyFooBar: function(oEvent) {
			let that = this;
			let valueMyFooBar = this.getView().byId("inputMyFooBar").getValue();
			let url=`/mysrvdemoService/myfoobar(msg='${valueMyFooBar}')`; //this is a REST API call
			$.ajax({
				url: url,
				type: 'GET',
				//data: $.param({msg: "Hi"}),
				contentType: "application/json",
				dataType: "json",
				async: false,				
				success: function(data){
					debugger;
					//console.log("success"+data);
					that.getView().byId("labelMyFooBar").setText(data.value);
				},
				error: function(e){
					debugger;
					console.log("error: "+e);
				}
			  });
		},

		onRowPress: function(oEvent) {
			let eMail = this.getView().byId(oEvent.getSource().getId()).getSelectedItem().getBindingContext().getProperty("email");

			//learned from https://youtu.be/fTmn8Z6j2Ns?t=1838
			//var oTable = this.getView().byId("oTable");
			//var eMail  = oTable.getSelectedItem().getBindingContext().getProperty("email");
			this.getOwnerComponent().getRouter().navTo("detail", {
				email: eMail
			});
			//oEvent.getParameter("listItem").getBindingContext().getProperty("email");
			//oEvent.getParameter("listItem").getBindingContext().getProperty("first_name");
		},

		onButtonPress: function(oEvent) {
			debugger;
			let obj = oEvent.getSource().getBindingContext().getObject();
			MessageToast.show(obj.first_name + " is clicked");
		},

		onSearch: function(oEvent) {
			debugger;
		}
	});
});