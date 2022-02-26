sap.ui.define([
    "./ServiceManager"
], function(
    ServiceManager
) {
	"use strict";
    var canvas;
    var ctx;
    var prefix_url = 'http://100.115.92.206:4004';

	return {
        callInitGame: function(me) {
            return new Promise(function(resolve,reject) {
                var that = me;
                let url = prefix_url + `/wordlistsrv/initGame()`; //this is a REST API call
    
                $.ajax({
                    url: url,
                    type: 'GET',
                    contentType: "application/json",
                    dataType: "json",
                    async: true,				
                    success: function(res) {
                        //console.log("call InitGame() successfullly.");
                        resolve(res);
                    },
                    error: function(e) {
                        console.log("error: "+e);
                        reject(e);
                    }
                });    
            });
        },


        initNoOfWords: function(me) {
            return new Promise(function(resolve,reject) {
                var that = me;
                let url = prefix_url + `/wordlistsrv/getNoOfWords()`; //this is a REST API call
    
                $.ajax({
                    url: url,
                    type: 'GET',
                    contentType: "application/json",
                    dataType: "json",
                    async: true,				
                    success: function(res) {
                        //console.log("call getNoOfWords() successfullly.");
                        resolve(res);
                    },
                    error: function(e) {
                        console.log("error: "+e);
                        reject(e);
                    }
                });    
            });
        },


        pickRandomWord: function(me) {
            return new Promise(function(resolve,reject) {
                var that = me;
                let url = prefix_url + `/wordlistsrv/pickRandomWord()`; //this is a REST API call
    
                $.ajax({
                    url: url,
                    type: 'GET',
                    contentType: "application/json",
                    dataType: "json",
                    async: true,				
                    success: function(res) {
                        //console.log("call pickRandomWord() successfullly.");
                        resolve(res);
                    },
                    error: function(e) {
                        console.log("error: "+e);
                        reject(e);
                    }
                });    
            });
        },


        returnChosenWord: function(me) {
            return new Promise(function(resolve,reject) {
                var that = me;
                let url = prefix_url + `/wordlistsrv/returnChosenWord()`; //this is a REST API call
    
                $.ajax({
                    url: url,
                    type: 'GET',
                    contentType: "application/json",
                    dataType: "json",
                    async: true,				
                    success: function(res) {
                        //console.log("call returnChosenWord() successfullly.");
                        resolve(res);
                    },
                    error: function(e) {
                        console.log("error: "+e);
                        reject(e);
                    }
                });    
            });
        },


        compareWords: function(enteredWord, me) {
            return new Promise(function(resolve,reject) {
                var that = me;
                let url = prefix_url + `/wordlistsrv/compareWords(enteredWord='${enteredWord}')`; //this is a REST API call
    
                $.ajax({
                    url: url,
                    type: 'GET',
                    contentType: "application/json",
                    dataType: "json",
                    async: true,				
                    success: function(res) {
                        //console.log("call compareWords() successfullly.");
                        resolve(res);
                    },
                    error: function(e) {
                        console.log("error: "+e);
                        reject(e);
                    }
                });    
            });
        },


        validateGuessInput: function(me, e) {
            const id = e.getParameter("id");
            const guess = e.getParameter("value");
            //e.getParameter("newValue")
            if (guess.length > 1) {
                me.byId(id).setValueState(sap.ui.core.ValueState.Error);
                me.byId(id).setValueStateText("Please enter only one alpha character.");
                return false;
            }
            if (!/^[a-zA-Z]$/.test(guess)) {
                me.byId(id).setValueState(sap.ui.core.ValueState.Error);
                me.byId(id).setValueStateText("Please enter only one alpha character.");
                return false;
            }
            me.byId(id).setValueState(sap.ui.core.ValueState.None);
            me.byId(id).setValueStateText("");
            return true;
        },

        initAction: function() {
            $("form").on("submit", function (e) {
                e.preventDefault();
                const guess = $(".guessInput").val();
                console.log(`${guess} submitted!!!`);
                $(".guessInput").val("");
                //ServiceManager.compareWords(guess);
            });
        },

        resetMan: function() {
            canvas = document.querySelector(".canvas");
            ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
            ctx.globalCompositeOperation = 'destination-over';
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
        },



        drawParts: function(num) {
            switch (num) {
                case 1:
                    this.head();
                    break;
                case 2:
                    this.body();
                    break;
                case 3:
                    this.leftLeg();
                    break;
                case 4:
                    this.rightLeg();
                    break;
                case 5:
                    this.leftArm();
                    break;
                case 6:
                    this.rightArm();
                    break;
                case 7:
                    this.face();
                    break;
            }
        },        


        head: function() {
            ctx.lineWidth = 8;
            ctx.strokeStyle = "black";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(400, 150, 50, Math.PI * 2, false);
            ctx.stroke();
        },


        face: function() {
            ctx.beginPath();
            //eyes
            ctx.fillStyle = "red";
            ctx.font = "bold 24px sans-serif";
            ctx.fillText("x", 375, 130);
            ctx.fillText("x", 410, 130);
            ctx.fillStyle = "white";
        
            //nose
            ctx.moveTo(400, 145);
            ctx.lineTo(400, 155);
        
            //mouth
            ctx.lineWidth = 2;
            ctx.moveTo(370, 170);
            ctx.lineTo(430, 170);
            ctx.stroke();
            ctx.save();
        
            //toungue
            ctx.beginPath();
            ctx.moveTo(405, 170);
            ctx.lineWidth = 0;
            ctx.quadraticCurveTo(412, 195, 420, 170);
            ctx.closePath();
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.strokeStyle = "red";
            ctx.stroke();
        },


        body: function() {
            ctx.beginPath();
            ctx.moveTo(400, 200);
            ctx.lineWidth = 8;
            ctx.strokeStyle = "black";
            ctx.lineTo(400, 320);
            ctx.stroke();
        },

        rightLeg: function() {
            ctx.beginPath();
            ctx.moveTo(400, 320);
            ctx.lineWidth = 8;
            ctx.strokeStyle = "black";
            ctx.lineTo(450, 420);
            ctx.lineTo(470, 420);
            ctx.stroke();
        },


        leftLeg: function() {
            ctx.beginPath();
            ctx.moveTo(400, 320);
            ctx.lineWidth = 8;
            ctx.strokeStyle = "black";
            ctx.lineTo(350, 420);
            ctx.lineTo(330, 420);
            ctx.stroke();
        },

        leftArm: function() {
            ctx.beginPath();
            ctx.moveTo(400, 220);
            ctx.lineWidth = 8;
            ctx.strokeStyle = "black";
            ctx.lineTo(350, 250);
            ctx.lineTo(330, 250);
            ctx.stroke();
        },
          

        rightArm: function() {
            ctx.beginPath();
            ctx.moveTo(400, 220);
            ctx.lineWidth = 8;
            ctx.strokeStyle = "black";
            ctx.lineTo(450, 250);
            ctx.lineTo(470, 250);
            ctx.stroke();
        }
	};
});