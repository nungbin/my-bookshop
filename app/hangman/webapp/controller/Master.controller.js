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
        }
	});
});