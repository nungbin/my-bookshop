sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function(
	Controller,
	JSONModel,
	MessageToast
) {
	"use strict";

	return Controller.extend("project2.project2.controller.Master", {
        onInit: function () {
            this._defaultODataModel  = this.getOwnerComponent().getModel();
			this._categoryODataModel = this.getOwnerComponent().getModel("categoryModel");
			//Load JSON from a file
			this._bookJSONModel      = this.getOwnerComponent().getModel("personDataModel");
			this.getView().setModel(this._bookJSONModel, "bookModel");

			// learned this from Vivek
			// at this point, Odata call isn't made yet since it's async.
			//this._categoryODataModel.metadataLoaded().then(this._onMetadataLoaded.bind(this));
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
				//_personJSON        = this._personJSONModel.getData();

				//_personJSON = Object.assign(_personJSON, obj);	
				//oEntityType[0].property.forEach(element => {  _personJSON[element.name] = ""; });

				//tCategoryJSONModel = new sap.ui.model.json.JSONModel({
				//	  "": oEntityType[0].property
				//}),

				//let _bookJSONModel = new JSONModel(_personJSON);
				//this.getView().setModel(_bookJSONModel, "bookModel");
		},	

        onClick: function (oEvent) {
            var sPath = "/Books";
            var that = this;

			this._categoryODataModel.read(sPath, {
				success: function (oModelData, oResponse) {
					//oData.BIC = oModelData.BIC;
					//oData.IBAN_CLABE_OTHERS = oModelData.IBAN_CLABE_OTHERS;
					//that.getView().getModel("trainingModel").setData(oData);  //refresh data on the screen
					debugger;
					if ( oModelData.results.length >= 1 ) {
						let oData = that.getView().getModel("bookModel").getData();
						//Below statement acts similar to ABAP's MOVE-CORRESPONDING
						oData = Object.assign(oData, oModelData.results[0]);
						that.getView().getModel("bookModel").setData(oData);
						//Bind result to the simple form
						that.getView().byId("sfBooks").bindElement({ path: "/", model: "bookModel" });
					}
				},
				error: function (oError) {
					MessageToast.show(this.getBundle().getText("MasterController.ERRORUnableToRetrieveABook"));
					debugger;
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
		}
	});
});