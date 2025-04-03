sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/m/MessageBox"
    
], (Controller,Filter,MessageBox) => {
    "use strict";

    return Controller.extend("com.sdm.sensordataui5.controller.View1", {
        onInit() {
            // Get router
            this.oRouter = this.getOwnerComponent().getRouter();
        },

        onPressgotoDetails: function (oEvent) {
            // Get the selected item's binding context
            var oSelectedItem = oEvent.getSource();
            var oBindingContext = oSelectedItem.getBindingContext().getPath();
            
            if (oBindingContext) {
                var oSplitApp = this.getView().byId("splitApp");
                // Bind the detail page to the selected item
                var oDetailPage = this.getView().byId("detailPage");
                oDetailPage.bindElement(oBindingContext); 
                sap.ui.core.BusyIndicator.show(0);
                loadDetailData().then(() => {
                    oSplitApp.toDetail(oDetailPage); // Navigate after data is loaded
                    let aSelectedDeviceID = this.getView().byId("selecteddeviceID").getText();
                    let oTablebindingData = this.getView().byId("readingstableID").getBinding("items");
                    let aFilter = new Filter({
                        path: "device_ID",
                        operator: "EQ",
                        value1: aSelectedDeviceID
                    });
                    oTablebindingData.filter([aFilter])

                }).catch(() => {
                    sap.m.MessageToast.show("Failed to load details");
                }).finally(() => {
                    sap.ui.core.BusyIndicator.hide()
                });
            }
            function loadDetailData() {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve();  // Simulating data load success
                    }, 500);
                });
            }

        },
        onNavBack: function () {
            var oSplitApp = this.getView().byId("splitApp");
            oSplitApp.backDetail();
        },
        onSelectingReadings: function(oEvent){
            let aAlert=oEvent.getSource().getSelectedItem().getBindingContext().getObject();
            let aFormdetails=this.getView().byId("detailPage").getBindingContext().getObject();
            // let Name= this.getView().byId("selecteddevicenameId").getText();
            // let Location= this.getView().byId("selecteddevicelocationId").getText();
            let aAlertMessage;
            if(aAlert.temperature > 40 ){
                if(aAlert.humidity > 85){
                aAlertMessage= "MESSAGE: The device "+ aFormdetails.Name  + " in " + aFormdetails.Location +
                                     " has recorded High Temperature with: " + aAlert.temperature +
                                     "°C and High Humidity with: " + aAlert.humidity+ "% "+ "\n"+
                                    "CONDITION: High Temperature and Humidity";
                }
                else{
                    aAlertMessage= "MESSAGE: The device "+ aFormdetails.Name  + " in " + aFormdetails.Location +
                                     " has recorded High Temperature with: " + aAlert.temperature +
                                     "°C and Normal Humidity with: " + aAlert.humidity+ "% "+ "\n"+
                                    "CONDITION: High Temperature";
                
                }
            }
            else{
                if(aAlert.humidity > 85){
                    aAlertMessage= "MESSAGE: The device "+ aFormdetails.Name  + " in " + aFormdetails.Location +
                                         " has recorded Normal Temperature with : " + aAlert.temperature +
                                         "°C and High Humidity with : " + aAlert.humidity+ "% "+ "\n"+
                                        "CONDITION: High Humidity";
                    }
                    else{
                        aAlertMessage= "MESSAGE: The device "+ aFormdetails.Name  + " in " + aFormdetails.Location +
                                         " has recorded Normally with Temperature : " + aAlert.temperature +
                                         "°C and Humidity : " + aAlert.humidity+ "% "+ "\n"+
                                        "CONDITION: Normal";
                    
                    }
            }
            MessageBox.alert(aAlertMessage);
        }
    });
});