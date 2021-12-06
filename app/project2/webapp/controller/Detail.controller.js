sap.ui.define([
	"sap/ui/core/mvc/Controller",
  "../model/formatter",
  "sap/m/MessageBox",
  "sap/m/MessageToast"
], function(
	Controller,
	formatter,
	MessageBox,
	MessageToast
) {
	"use strict";

	return Controller.extend("project2.project2.controller.Detail", {
        /**
         * @override
         */
         formatter: formatter,

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
            this.byId("sfDetail").setEditable(false);
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
            var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern: "yyyy-mm-dd"});
            let studentModel = this.getOwnerComponent().getModel(); //get the default oData model
            let studentData  = this.getView().byId("sfDetail").getBindingContext().getObject();
            let objData      = this.getOwnerComponent().getModel("studentModel").getData();

            // var objData = 
            // {
            //     "email":        "3@gmail.com",
            //     "first_name":   "first 33",
            //     "last_name":    "last 33",
            //     "date_sign_up": "2021-12-05"
            // };
            objData.email        = this.byId("dtEmail").getValue();
            objData.first_name   = this.byId("dtFirstName").getValue();
            objData.last_name    = this.byId("dtLastName").getValue();
            objData.date_sign_up = new Date(this.byId("dtDateSignUp").getValue());
            studentModel.update("/Students(email='" + objData.email + "')", 
                objData, {
                  success: function(oData) {
                    let oEmail = that.byId("dtEmail").getValue();

                    that.getOwnerComponent().getModel("UIControlModel").setProperty("/mainRefresh", true)
                    MessageToast.show("Student with email " + oEmail + " updated!");
                    //Refresh the screen and set to display mode!!!
                    that.getView().byId("sfDetail").bindElement("/StudentSrv(email='" + oEmail + "')");
                    that.byId("sfDetail").setEditable(false);
                  }, 
                  error: function(error) {
                      console.log(error);
                      debugger;
                  }
                });
        },

        onDeleteStudent: function(oEVent) {
          var that = this;
          let oData = this.getView().byId("sfDetail").getBindingContext().getObject();
          let sTitle = "Delete " + oData.email + " ?";

          MessageBox.show("Are you sure you would like to delete this record?", {
              icon: MessageBox.Icon.INFORMATION,
              title: sTitle ,
              actions: [MessageBox.Action.YES, MessageBox.Action.NO],
              emphasizedAction: MessageBox.Action.NO,
              onClose: function (oAction) {
                if (oAction === 'YES') {
                  that._deleteRecord(oData);
                }
              }
            }
          );
        },


        _deleteRecord: function(oData) {
            // a good reference for CRUD operation for oDataModel
            // https://sapui5.hana.ondemand.com/#/topic/6c47b2b39db9404582994070ec3d57a2.html%23loioff667e12b8714f3595e68f3e7c0e7a14
            var that = this;
            let studentModel = this.getOwnerComponent().getModel(); //get the default oData model
            debugger;

            studentModel.remove("/Students(email='" + oData.email + "')", {
              success: function(oData) {
                that.getOwnerComponent().getModel("UIControlModel").setProperty("/mainRefresh", true)
                MessageToast.show("Student with email " + that.byId("dtEmail").getValue() + " deleted!", {
                  duration: 1000,
                  onClose: function() {
                    that.onNavPress();
                  }
                });
              }, 
              error: function(error) {
                console.log(error);
              }
            });
        }
	});
});