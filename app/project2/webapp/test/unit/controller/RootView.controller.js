/*global QUnit*/

sap.ui.define([
	"project2/project2/controller/RootView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("RootView Controller");

	QUnit.test("I should test the RootView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
