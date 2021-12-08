sap.ui.define([
	"sap/ui/core/mvc/Controller",
  "../model/formatter",
  "sap/m/MessageBox",
  "sap/m/MessageToast",
	"../Services/ServiceManager"
], function(
	Controller,
	formatter,
	MessageBox,
	MessageToast,
	ServiceManager
) {
	"use strict";
  var _oOriginalData,
      _firstTime;

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
            
            this.getView().byId("sfDetail").bindElement("/StudentSrv(email='" + eMail + "')", {
              expand: "country($select=code,name)"
            });
            //this.getView().bindElement("/StudentSrv(email='" + eMail + "')");
            this.byId("idUpdateStudent").setEnabled(false);
            this.byId("idDeleteStudent").setEnabled(false);
            this.byId("sfDetail").setEditable(false);

            //This is the proper place to initialize variables, not in the onInit.
            _oOriginalData = "";
            _firstTime = true;
          },

        onEditToggled: function(oEvent) {
          this.byId("idUpdateStudent").setEnabled(oEvent.getSource().getEditable());
          this.byId("idDeleteStudent").setEnabled(oEvent.getSource().getEditable());
          if (_firstTime) {
            _oOriginalData = this._getStudentRecordfromScreen();
            _firstTime = false;
          }
        },

        onNavPress: function() {
            //let studentData  = this.getView().byId("sfDetail").getBindingContext().getObject();
            var that    = this;
            let sTitle  = "Unsaved Record?";
            let objData = this._getStudentRecordfromScreen();

            if (!_firstTime) {
              if (ServiceManager.checkUpdateStudent(_oOriginalData, objData)) {
                this.getOwnerComponent().getRouter().navTo("RouteRootView");
              }
              else {
                MessageBox.show("You have unsaved record. Exit?", {
                  icon: MessageBox.Icon.QUESTION,
                  title: sTitle ,
                  actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                  emphasizedAction: MessageBox.Action.NO,
                  onClose: function (oAction) {
                    if (oAction === 'YES') {
                      that.getOwnerComponent().getRouter().navTo("RouteRootView");
                    }
                  }
                });
              }
            }
            else{
              this.getOwnerComponent().getRouter().navTo("RouteRootView");
            }
        },

        onUpdateStudent: function(oEvent) {
            var that = this;
            //var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern: "yyyy-mm-dd"});
            let studentModel = this.getOwnerComponent().getModel(); //get the default oData model
            let objData      = JSON.parse(this._getStudentRecordfromScreen());
            
            studentModel.update("/Students(email='" + objData.email + "')", 
                objData, {
                  success: function(oData) {
                    let oEmail = that.byId("dtEmail").getValue();

                    that.getOwnerComponent().getModel("UIControlModel").setProperty("/mainRefresh", true)
                    MessageToast.show("Student with email " + oEmail + " updated!");
                    //Refresh the screen and set to display mode!!!
                    that.getView().byId("sfDetail").bindElement("/StudentSrv(email='" + oEmail + "')", {
                      expand: "country($select=code,name)"
                    });
                    that.byId("sfDetail").setEditable(false);
                    _firstTime = true;
                  }, 
                  error: function(error) {
                      console.log(error);
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
                else {
                  that.byId("sfDetail").setEditable(false);
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

            studentModel.remove("/Students(email='" + oData.email + "')", {
              success: function(oData) {
                that.getOwnerComponent().getModel("UIControlModel").setProperty("/mainRefresh", true)
                MessageToast.show("Student with email " + that.byId("dtEmail").getValue() + " deleted!", {
                  duration: 500,
                  onClose: function() {
                    _firstTime = true;
                    that.onNavPress();
                  }
                });
              }, 
              error: function(error) {
                console.log(error);
              }
            });
        },

        _getStudentRecordfromScreen: function() {
            let tmpData = this.getOwnerComponent().getModel("studentModel").getData();
            // var objData = 
            // {
            //     "email":        "3@gmail.com",
            //     "first_name":   "first 33",
            //     "last_name":    "last 33",
            //     "date_sign_up": "2021-12-05"
            // };
            tmpData.email        = this.byId("dtEmail").getValue();
            tmpData.first_name   = this.byId("dtFirstName").getValue();
            tmpData.last_name    = this.byId("dtLastName").getValue();
            tmpData.date_sign_up = new Date(this.byId("dtDateSignUp").getValue());
            tmpData.grade        = this.byId("dtGrade").getValue();
            tmpData.country_code = this.byId("dtCountryCode").getValue();
            return JSON.stringify(tmpData);
        }
	});
});