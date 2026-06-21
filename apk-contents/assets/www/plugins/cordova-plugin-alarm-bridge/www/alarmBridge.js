cordova.define("cordova-plugin-alarm-bridge.AlarmBridge", function(require, exports, module) {
var exec = require('cordova/exec');

var AlarmBridge = {
  getDeviceId: function (successCallback, errorCallback) {
    console.log("alarmBridge.js: getDeviceId called");
    exec(
      function(res) {
        console.log("alarmBridge.js: getDeviceId success", res);
        if (successCallback) successCallback(res);
      },
      function(err) {
        console.error("alarmBridge.js: getDeviceId error", err);
        if (errorCallback) errorCallback(err);
      },
      "AlarmBridge",
      "getDeviceId",
      []
    );
  },
  setVehicleId: function (vehicleId, successCallback, errorCallback) {
    console.log("alarmBridge.js: setVehicleId called with vehicleId: " + vehicleId);
    exec(
      function(res) {
        console.log("alarmBridge.js: setVehicleId success", res);
        if (successCallback) successCallback(res);
      },
      function(err) {
        console.error("alarmBridge.js: setVehicleId error", err);
        if (errorCallback) errorCallback(err);
      },
      "AlarmBridge",
      "setVehicleId",
      [vehicleId]
    );
  },
  setTruckNumber: function (truckNumber, successCallback, errorCallback) {
    console.log("alarmBridge.js: setTruckNumber called with: " + truckNumber);
    exec(
      function(res) {
        console.log("alarmBridge.js: setTruckNumber success", res);
        if (successCallback) successCallback(res);
      },
      function(err) {
        console.error("alarmBridge.js: setTruckNumber error", err);
        if (errorCallback) errorCallback(err);
      },
      "AlarmBridge",
      "setTruckNumber",
      [truckNumber]
    );
  },
  setAcceptedChallan: function (acceptedChallan, successCallback, errorCallback) {
    console.log("alarmBridge.js: setAcceptedChallan called with: " + acceptedChallan);
    exec(
      function(res) {
        console.log("alarmBridge.js: setAcceptedChallan success", res);
        if (successCallback) successCallback(res);
      },
      function(err) {
        console.error("alarmBridge.js: setAcceptedChallan error", err);
        if (errorCallback) errorCallback(err);
      },
      "AlarmBridge",
      "setAcceptedChallan",
      [acceptedChallan]
    );
  },
  setLastProcessedChallan: function (lastProcessedChallan, successCallback, errorCallback) {
    console.log("alarmBridge.js: setLastProcessedChallan called with: " + lastProcessedChallan);
    exec(
      function(res) {
        console.log("alarmBridge.js: setLastProcessedChallan success", res);
        if (successCallback) successCallback(res);
      },
      function(err) {
        console.error("alarmBridge.js: setLastProcessedChallan error", err);
        if (errorCallback) errorCallback(err);
      },
      "AlarmBridge",
      "setLastProcessedChallan",
      [lastProcessedChallan]
    );
  },
  showTripAlert: function (tripId, successCallback, errorCallback) {
    console.log("alarmBridge.js: showTripAlert called with tripId: " + tripId);
    exec(
      function(res) {
        console.log("alarmBridge.js: showTripAlert success", res);
        if (successCallback) successCallback(res);
      },
      function(err) {
        console.error("alarmBridge.js: showTripAlert error", err);
        if (errorCallback) errorCallback(err);
      },
      "AlarmBridge",
      "showTripAlert",
      [tripId]
    );
  },
  stopTripAlert: function (successCallback, errorCallback) {
    console.log("alarmBridge.js: stopTripAlert called");
    exec(
      function(res) {
        console.log("alarmBridge.js: stopTripAlert success", res);
        if (successCallback) successCallback(res);
      },
      function(err) {
        console.error("alarmBridge.js: stopTripAlert error", err);
        if (errorCallback) errorCallback(err);
      },
      "AlarmBridge",
      "stopTripAlert",
      []
    );
  },
  requestNotificationPermission: function (successCallback, errorCallback) {
    console.log("alarmBridge.js: requestNotificationPermission called");
    exec(
      function(res) {
        console.log("alarmBridge.js: requestNotificationPermission success", res);
        if (successCallback) successCallback(res);
      },
      function(err) {
        console.error("alarmBridge.js: requestNotificationPermission error", err);
        if (errorCallback) errorCallback(err);
      },
      "AlarmBridge",
      "requestNotificationPermission",
      []
    );
  },
  requestFullScreenIntentPermission: function (successCallback, errorCallback) {
    console.log("alarmBridge.js: requestFullScreenIntentPermission called");
    exec(
      function(res) {
        console.log("alarmBridge.js: requestFullScreenIntentPermission success", res);
        if (successCallback) successCallback(res);
      },
      function(err) {
        console.error("alarmBridge.js: requestFullScreenIntentPermission error", err);
        if (errorCallback) errorCallback(err);
      },
      "AlarmBridge",
      "requestFullScreenIntentPermission",
      []
    );
  },
  requestOverlayPermission: function (successCallback, errorCallback) {
    console.log("alarmBridge.js: requestOverlayPermission called");
    exec(
      function(res) {
        console.log("alarmBridge.js: requestOverlayPermission success", res);
        if (successCallback) successCallback(res);
      },
      function(err) {
        console.error("alarmBridge.js: requestOverlayPermission error", err);
        if (errorCallback) errorCallback(err);
      },
      "AlarmBridge",
      "requestOverlayPermission",
      []
    );
  },
  requestBatteryOptimizationExemption: function (successCallback, errorCallback) {
    console.log("alarmBridge.js: requestBatteryOptimizationExemption called");
    exec(
      function(res) {
        console.log("alarmBridge.js: requestBatteryOptimizationExemption success", res);
        if (successCallback) successCallback(res);
      },
      function(err) {
        console.error("alarmBridge.js: requestBatteryOptimizationExemption error", err);
        if (errorCallback) errorCallback(err);
      },
      "AlarmBridge",
      "requestBatteryOptimizationExemption",
      []
    );
  },
  setLanguage: function (language, successCallback, errorCallback) {
    console.log("alarmBridge.js: setLanguage called with: " + language);
    exec(
      function(res) {
        console.log("alarmBridge.js: setLanguage success", res);
        if (successCallback) successCallback(res);
      },
      function(err) {
        console.error("alarmBridge.js: setLanguage error", err);
        if (errorCallback) errorCallback(err);
      },
      "AlarmBridge",
      "setLanguage",
      [language]
    );
  },
  showFreeNotification: function (reason, successCallback, errorCallback) {
    console.log("alarmBridge.js: showFreeNotification called with reason: " + reason);
    exec(
      function(res) {
        console.log("alarmBridge.js: showFreeNotification success", res);
        if (successCallback) successCallback(res);
      },
      function(err) {
        console.error("alarmBridge.js: showFreeNotification error", err);
        if (errorCallback) errorCallback(err);
      },
      "AlarmBridge",
      "showFreeNotification",
      [reason]
    );
  }
};

module.exports = AlarmBridge;
});
