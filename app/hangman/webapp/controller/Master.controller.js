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

            //https://answers.sap.com/questions/13422236/hide-launchpad-navigation-bar.html
            //  we hide the launchpad header bar
            if (sap.ushell !== undefined) {
                if (sap.ushell.Container.getRenderer("fiori2")) {
                    sap.ushell.Container.getRenderer("fiori2").setHeaderVisibility(false, true);
                }    
            }

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

            //set canvas width and height
            //const p = $(".div2").position();
            const p = document.querySelector('.div2');
            const canvas = document.querySelector(".canvas");
            //canvas.width  = 580;
            //canvas.height = 600;
            canvas.width  = p.offsetWidth;
            canvas.height = p.offsetHeight;

            this.byId("lblEncryptedWord").setText("_ _ _ _");
            this.byId("lblFeedback").setText("");
            ServiceManager.resetMan();
            ServiceManager.drawGallows();
            //set initial focus
            setTimeout(() => {
                that.byId("guessInput").focus();
            }, 200);

            $(window).resize(function() {
                //trigger the window resize event
                // const p = document.querySelector('.div2');
                // const canvas = document.querySelector(".canvas");

                // canvas.width  = p.offsetWidth;
                // canvas.height = p.offsetHeight;                        
                // ServiceManager.resetMan();
                // ServiceManager.drawGallows();
            });
        },


        onLiveChange: function(e) {
            ServiceManager.validateGuessInput(this, e);
        },

        onInputSubmit: function(e) {
            var that = this;
            const id = e.getParameter("id"); 
            const enteredWord = this.byId(id).getValue();
            if (ServiceManager.validateGuessInput(this, e) === false) {
                return;
            }
            this.byId(id).setValue("");

            ServiceManager.compareWords(enteredWord, this)
                .then(function (res) {
                    let feedback = that.byId("lblFeedback").getText();
                    if (feedback === '') {
                        feedback = enteredWord.toUpperCase();
                    }
                    else {
                        feedback = feedback + ', ' + enteredWord.toUpperCase();
                    }
                    that.byId("lblFeedback").setText(feedback);
                    that.byId("lblEncryptedWord").setText(res.value.encryptedArray);
                    if (res.value.won) {
                        setTimeout(() => {
                            MessageToast.show("You won! Game will be restarting in 2 seconds...", {
                                duration: 2000,
                                onClose: () => {
                                    that.onInit();
                                    that.onAfterRendering();
                                }
                            });
                            //alert("You won! Game will be restarting...");
                            // setTimeout(() => {
                            //     that.onInit();
                            //     that.onAfterRendering();    
                            // }, 1000);
                        }, 100);
                    }
                    else if (res.value.gameOver) {
                        ServiceManager.drawParts(res.value.incorrectCounter);
                        setTimeout(() => {
                            MessageToast.show(`Sorry, you lost! The word was '${res.value.originalWord}' \n\rGame will be restarting in 5 seconds...`, {
                                duration: 5000,
                                onClose: () => {
                                    that.onInit();
                                    that.onAfterRendering();
                                }
                            });
                            //alert("You won! Game will be restarting...");
                            // setTimeout(() => {
                            //     that.onInit();
                            //     that.onAfterRendering();    
                            // }, 1000);
                        }, 100);
                    }
                    else {
                        ServiceManager.drawParts(res.value.incorrectCounter);
                    }
                })
                .catch(function(msg) {
                    console.log(msg);
                });
        }
	});
});