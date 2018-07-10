/*global history*/

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/demo/bulletinboard/model/formatter",
	"sap/ui/demo/bulletinboard/model/FlaggedType",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, JSONModel, formatter, FlaggedType, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("sap.ui.demo.bulletinboard.controller.Worklist", {
		types: {
			flagged: new FlaggedType()
		},

		formatter: formatter,

		onInit: function () {
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("table");

			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [window.location.href]),
				tableBusyDelay: 0
			});
			this.getView().setModel(oViewModel, "worklistView");

			oTable.attachEventOnce("updateFinished", function () {
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});
		},

		onUpdateFinished: function (oEvent) {

		},

		onPress: function (oEvent) {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("post", {
				postId: oEvent.getSource().getBindingContext().getProperty("PostID")
			});

		},

		onShareEmailPress: function () {
			var oViewModel = this.getView().getModel("worklistView");
			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		}

	});

});