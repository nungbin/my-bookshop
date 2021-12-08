sap.ui.define([
], function(
) {
	"use strict";

	return  {
        initJSONModel: function() {

        },

        validateEmailFormat: function(sText) {
            let eMailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
            let sReturn="";
            if (sText === "") {
                sReturn = "Email cannot be blank!";
            }
            else if (!eMailregex.test(sText)) {
                sReturn = sText + " is not a valid email address";
            }
            return sReturn;
        },

        checkUpdateStudent: function(sOriginal, sNew) {
            let oOriginal = JSON.parse(sOriginal),
                oNew      = JSON.parse(sNew);

            if ( (oOriginal.email         === oNew.email) &&
                 (oOriginal.first_name    === oNew.first_name) &&
                 (oOriginal.last_name     === oNew.last_name) &&
                 (oOriginal.date_sign_up  === oNew.date_sign_up) &&
                 (oOriginal.grade         === oNew.grade) &&
                 (oOriginal.country_code  === oNew.country_code) ) {
                    return true;
            }
            return false;
        },


        prepareStudentData: function(o1, o2) {
            o2.email        = o1.email;
            o2.first_name   = o1.first_name;            
            o2.last_name    = o1.last_name;
            o2.date_sign_up = o1.date_sign_up;
            o2.grade        = o1.grade;
            o2.country_code = o1.country_code;
        }
	};
});