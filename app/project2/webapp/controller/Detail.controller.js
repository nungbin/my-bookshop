sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(
	Controller,
	MessageToast
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
            this.getView().byId("sfDetail").bindElement("/StudentSrv(email='" + eMail + "')");
            //this.getView().bindElement("/StudentSrv(email='" + eMail + "')");
            this.byId("idUpdateStudent").setEnabled(false);
            this.byId("idDeleteStudent").setEnabled(false);
        },

        onNavPress: function() {
            this.getOwnerComponent().getRouter().navTo("RouteRootView");
        },

        onEditToggled: function(oEvent) {
            this.byId("idUpdateStudent").setEnabled(oEvent.getSource().getEditable());
            this.byId("idDeleteStudent").setEnabled(oEvent.getSource().getEditable());
        },

        onUpdateStudent: function(oEvent) {
            var that = this;
            let studentModel = this.getOwnerComponent().getModel();
            let studentData  = this.getView().byId("sfDetail").getBindingContext().getObject();
            let objData      = studentData;

            // var objData = 
            // {
            //     "email":        "3@gmail.com",
            //     "first_name":   "first 33",
            //     "last_name":    "last 33",
            //     "date_sign_up": "2021-12-05"
            // };
            objData.first_name   = this.byId("dtFirstName").getValue();
            objData.last_name    = this.byId("dtLastName").getValue();
            debugger;
            objData.date_sign_up = this.byId("dtDateSignUp").getValue();
            studentModel.update("/Students(email='" + objData.email + "')", 
                objData, {
                  success: function(oData) {
                    MessageBox.show("Student with email " + that.byId("dtEmail").getValue() + "has been updated successfully!");
                    debugger;
                  }, 
                  error: function(error) {
                      debugger;
                  }
                });

        },

        onDeleteStudent: function(oEVent) {
            // a good reference for CRUD operation for oDatamOdel
            // https://sapui5.hana.ondemand.com/#/topic/6c47b2b39db9404582994070ec3d57a2.html%23loioff667e12b8714f3595e68f3e7c0e7a14
            var that = this;
            let studentModel = this.getOwnerComponent().getModel();
            let oData = this.getView().byId("sfDetail").getBindingContext().getObject();

            studentModel.remove("/Students(email='" + oData.email + "')", {
              success: function(oData) {
                MessageToast.show("Student with email " + that.byId("dtEmail").getValue() + "has been deleted successfully!");
              }, 
              error: function(error) {
                console.log(error);
              }
            });
        }
	});
});