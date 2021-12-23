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
        },

        /**
         * @override
         */
        onAfterRendering: function() {
            ServiceManager.resetMan();
            ServiceManager.drawGallows();
            ServiceManager.initAction();
            //ServiceManager.drawParts(1);
            //ServiceManager.drawParts(2);
            //ServiceManager.drawParts(3);
            //ServiceManager.drawParts(4);
            //ServiceManager.drawParts(5);
            //ServiceManager.drawParts(6);
            //ServiceManager.drawParts(7);
        }
	});
});