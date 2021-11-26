sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(
	Controller,
    MessageToast
) {
	"use strict";

	return Controller.extend("project2.project2.controller.Master", {
        onInit: function () {
            this._defaultODataModel  = this.getOwnerComponent().getModel();
			this._categoryODataModel = this.getOwnerComponent().getModel("categoryModel");
			//Load JSON from a file
			this._personJSONModel    = this.getOwnerComponent().getModel("personDataModel");
			let _personJSON          = this._personJSONModel.getData();
			_personJSON = Object.assign(_personJSON, { } );

			debugger;
        },

        onClick: function (oEvent) {
            //MessageToast.show("get Clicked");

            var sPath = "/Books";
            var that = this;
            debugger;

			this._categoryODataModel.read(sPath, {
				success: function (oModelData, oResponse) {
					/* do something */
					//var oData = that.getView().getModel("trainingModel").getData();
					//oData.BIC = oModelData.BIC;
					//oData.IBAN_CLABE_OTHERS = oModelData.IBAN_CLABE_OTHERS;
					//that.getView().getModel("trainingModel").setData(oData);  //refresh data on the screen
                    debugger;
				},
				error: function (oError) {
					/* do something */
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