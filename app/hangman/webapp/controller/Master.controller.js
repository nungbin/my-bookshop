sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "../services/ServiceManager"
], function(
	Controller,
    ServiceManager
) {
	"use strict";

	return Controller.extend("Project.Hangman.hangman.controller.Master", {
        /**
         * @override
         */
        onInit: function() {
            //Controller.prototype.onInit.apply(this, arguments);
            //Promise.all calls all of them at the same time.
            // Promise.all([ ServiceManager.callInitGame(this),
            //               ServiceManager.initNoOfWords(this),
            //               ServiceManager.pickRandomWord(this)
            //            ])
            //        .then(function(res) {
            //            //res will be an array
            //            //console.log(res.value);
            //        }).catch(function(msg) {
            //            console.log(msg);
            //        });
            var that = this;

            ServiceManager.callInitGame(this)
                .then(function (res) {
                    return ServiceManager.initNoOfWords(this);
                })
                .then(function (res) {
                    return ServiceManager.pickRandomWord(this);
                })
                .then(function (res) {
                    return ServiceManager.returnChosenWord(this);
                })
                .then(function (res) {
                    that.byId("lblEncryptedWord").setText(res.value);
                })
                .catch(function(msg) {
                    console.log(msg);
                });
        },

        /**
         * @override
         */
        onAfterRendering: function() {
            var that = this;

            ServiceManager.resetMan();
            ServiceManager.drawGallows();
            //set initial focus
            setTimeout(() => {
                that.byId("guessInput").focus();
            }, 200);
            
            //ServiceManager.initAction();
            //ServiceManager.drawParts(1);
            //ServiceManager.drawParts(2);
            //ServiceManager.drawParts(3);
            //ServiceManager.drawParts(4);
            //ServiceManager.drawParts(5);
            //ServiceManager.drawParts(6);
            //ServiceManager.drawParts(7);
        },

        onInputSubmit: function(e) {
            const id = e.getParameter("id"); 
            alert(this.byId(id).getValue());
            this.byId(id).setValue("");
        }
	});
});