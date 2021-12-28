sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "../services/ServiceManager"
], function(
	Controller,
    MessageToast,
    ServiceManager
) {
	"use strict";

	return Controller.extend("Project.Hangman.hangman.controller.Master", {
        /**
         * @override
         */
        onInit: function() {
        },

        /**
         * @override
         */
        onAfterRendering: function() {
            const width =  $(".col-sm").width();
            const height = $(".col-sm").height();
            const p = $(".exampleDiv").position();
            //$(".exampleDiv").height(height).width(width);
            
            const canvas = document.querySelector(".canvas2");
            //var canvas = document.getElementById("Canvas2");
            var ctx = canvas.getContext("2d");
            canvas.width  = 580;
            canvas.height = 600;
        },

	});
});