sap.ui.define([
], function(
) {
	"use strict";
    var canvas;
    var ctx;

	return {
        resetMan: function() {
            canvas = document.querySelector(".canvas");
            ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        },

        drawGallows: function() {
            ctx.beginPath();
            ctx.moveTo(50, 550);
            ctx.lineTo(250, 550);
            ctx.moveTo(150, 550);
            ctx.lineTo(150, 50);
            ctx.lineTo(400, 50);
            ctx.moveTo(150, 200);
            ctx.lineTo(250, 50);
            ctx.lineWidth = 12;
            ctx.strokeStyle = "black";
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(400, 50);
            ctx.lineWidth = 8;
            ctx.strokeStyle = "tan";
            ctx.lineTo(400, 100);
            ctx.stroke();
        }
	};
});