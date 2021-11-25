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
            this._defaultODataModel = this.getOwnerComponent().getModel();
            debugger;
        },

        onClick: function (oEvent) {
            MessageToast.show("get Clicked");

            var sPath = "/StudentSrv";
            var that = this;
            debugger;

			this._defaultODataModel.read(sPath, {
				success: function (oModelData, oResponse) {
					/* do something */
					//var oData = that.getView().getModel("trainingModel").getData();
					//oData.BIC = oModelData.BIC;
					//oData.IBAN_CLABE_OTHERS = oModelData.IBAN_CLABE_OTHERS;
					//that.getView().getModel("trainingModel").setData(oData);  //refresh data on the screen
                    debugger;
					that.getView().getModel("trainingModel").setData(oModelData); //refresh data on the screen
				},
				error: function (oError) {
					/* do something */
					debugger;
				}
			});            
        }
	});
});