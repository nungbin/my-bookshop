sap.ui.define([], function () {
  "use strict";
  return {
    combineText: function (sFirstname, sLastname) {
        return sLastname + ", " + sFirstname
        //http://www.amarmn.com/sapui5-custom-formatter-functions-how-to-use-part-8-sapui5-tutorial-for-beginners/
        //   var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
        //   var finalText = sShipperName + " " + sShippedDate + " ";
        //   switch (sStatus) {
        //     case "A":
        //       return finalText + resourceBundle.getText("StatusA");
        //     case "B":
        //       return finalText + resourceBundle.getText("StatusB");
        //     case "C":
        //       return finalText + resourceBundle.getText("StatusC");
        //     default:
        //       return finalText + sStatus;
        //   }
    },
    numberState: function (sPrice) {
      if (sPrice > 10) {
        return "Error";
      } else {
        return "Success";
      }
    },
  };
});
