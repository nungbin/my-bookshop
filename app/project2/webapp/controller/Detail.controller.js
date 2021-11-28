sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("project2.project2.controller.Detail", {
        /**
         * @override
         */
        onInit: function() {
            //Controller.prototype.onInit.apply(this, arguments);
            this.getOwnerComponent().getRouter().getRoute("detail").attachPatternMatched(this.objectMatched, this);
        },

        objectMatched: function(oEvent) {
            //http://localhost:4004/mysrvdemoService/StudentSrv(email='2@gmail.com')
            let eMail = oEvent.getParameter("arguments").email;
            //below statement makes another oData call
            //this.getView().bindElement("/StudentSrv(email='" + eMail + "')");
            this.getView().byId("sfDetail").bindElement("/StudentSrv(email='" + eMail + "')");
        },

        onNavPress: function() {
            this.getOwnerComponent().getRouter().navTo("RouteRootView");
        }
	});
});