package com.fleettrackon.terminal;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import android.content.*;
import androidx.core.content.ContextCompat;
import android.os.Build;
import android.os.PowerManager;
import android.provider.Settings;
import android.net.Uri;
import android.app.NotificationManager;
import android.util.Log;

public class AlarmBridge extends CordovaPlugin {
    private static final String TAG = "AlarmBridge_Plugin";

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        Context context = cordova.getContext();
        SharedPreferences prefs = context.getSharedPreferences("AlarmBridgePrefs", Context.MODE_PRIVATE);

        Log.d(TAG, "execute() action='" + action + "' args='" + args.toString() + "'");

        if ("getDeviceId".equals(action)) {
            try {
                String androidId = Settings.Secure.getString(
                    context.getContentResolver(),
                    Settings.Secure.ANDROID_ID
                );
                if (androidId == null || androidId.trim().isEmpty()) {
                    androidId = Build.SERIAL;
                }
                callbackContext.success(androidId);
            } catch (Throwable t) {
                Log.e(TAG, "Failed to read Android device ID", t);
                callbackContext.error("Unable to read Android device ID");
            }
            return true;

        } else if ("requestNotificationPermission".equals(action)) {
            try {
                if (Build.VERSION.SDK_INT >= 33) { // Android 13+
                    String permission = "android.permission.POST_NOTIFICATIONS";
                    Log.d(TAG, "Checking POST_NOTIFICATIONS permission...");
                    if (!cordova.hasPermission(permission)) {
                        Log.d(TAG, "Requesting POST_NOTIFICATIONS permission...");
                        cordova.requestPermission(this, 103, permission);
                    } else {
                        Log.d(TAG, "POST_NOTIFICATIONS permission already granted.");
                    }
                } else {
                    Log.d(TAG, "API level < 33, POST_NOTIFICATIONS not required.");
                }
            } catch (Throwable t) {
                Log.e(TAG, "Failed to request notification permission", t);
            }
            callbackContext.success();
            return true;

        } else if ("requestFullScreenIntentPermission".equals(action)) {
            try {
                if (Build.VERSION.SDK_INT >= 34) { // Android 14+
                    NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
                    Log.d(TAG, "Checking FullScreenIntent capability...");
                    try {
                        if (nm != null && !nm.canUseFullScreenIntent()) {
                            Log.d(TAG, "Requesting MANAGE_APP_USE_FULL_SCREEN_INTENT permission...");
                            Intent intent = new Intent("android.settings.MANAGE_APP_USE_FULL_SCREEN_INTENT");
                            intent.setData(Uri.parse("package:" + context.getPackageName()));
                            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            context.startActivity(intent);
                        } else {
                            Log.d(TAG, "FullScreenIntent is allowed or NotificationManager is null.");
                        }
                    } catch (Throwable inner) {
                        Log.e(TAG, "Error checking/requesting FullScreenIntent settings", inner);
                    }
                } else {
                    Log.d(TAG, "API level < 34, MANAGE_APP_USE_FULL_SCREEN_INTENT not required.");
                }
            } catch (Throwable t) {
                Log.e(TAG, "Failed to request FullScreenIntent permission", t);
            }
            callbackContext.success();
            return true;

        } else if ("requestOverlayPermission".equals(action)) {
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    Log.d(TAG, "Checking draw overlay permission...");
                    if (!Settings.canDrawOverlays(context)) {
                        Log.d(TAG, "Requesting overlay permission...");
                        Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
                        intent.setData(Uri.parse("package:" + context.getPackageName()));
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        context.startActivity(intent);
                    } else {
                        Log.d(TAG, "Overlay permission already granted.");
                    }
                }
            } catch (Throwable t) {
                Log.e(TAG, "Failed to request overlay permission", t);
            }
            callbackContext.success();
            return true;

        } else if ("requestBatteryOptimizationExemption".equals(action)) {
            // CRITICAL: Ask the user to exclude PCS Tracking from battery optimization
            // Without this, Android Doze mode will KILL the foreground service polling!
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
                    Log.d(TAG, "Checking battery optimization exemptions...");
                    if (pm != null && !pm.isIgnoringBatteryOptimizations(context.getPackageName())) {
                        Log.d(TAG, "Requesting Battery Optimization exemption...");
                        Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                        intent.setData(Uri.parse("package:" + context.getPackageName()));
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        context.startActivity(intent);
                    } else {
                        Log.d(TAG, "Battery Optimization exemption already configured.");
                    }
                }
            } catch (Throwable t) {
                Log.e(TAG, "Failed to request battery optimization exemption", t);
            }
            callbackContext.success();
            return true;

        } else if ("setVehicleId".equals(action)) {
            String vehicleId = args.getString(0);
            Log.d(TAG, "Saving vehicleId: " + vehicleId);
            prefs.edit().putString("vehicleId", vehicleId).apply();

            // Start the unified background polling service safely from the foreground
            try {
                Log.d(TAG, "Starting BackgroundPollingService...");
                Intent serviceIntent = new Intent(context, BackgroundPollingService.class);
                ContextCompat.startForegroundService(context, serviceIntent);
                Log.d(TAG, "BackgroundPollingService startForegroundService call completed.");
            } catch (Throwable t) {
                Log.e(TAG, "Failed to start BackgroundPollingService", t);
            }

            callbackContext.success();
            return true;

        } else if ("setTruckNumber".equals(action)) {
            String truckNumber = args.getString(0);
            Log.d(TAG, "Saving truckNumber: " + truckNumber);
            prefs.edit().putString("truckNumber", truckNumber).apply();
            callbackContext.success();
            return true;

        } else if ("setAcceptedChallan".equals(action)) {
            String acceptedChallan = args.getString(0);
            Log.d(TAG, "Saving acceptedChallan: " + acceptedChallan);
            prefs.edit().putString("acceptedChallan", acceptedChallan).apply();

            // Stop the alarm via action intent to the unified service
            try {
                Log.d(TAG, "Triggering STOP_ALARM action on BackgroundPollingService...");
                Intent stopIntent = new Intent(context, BackgroundPollingService.class);
                stopIntent.setAction("STOP_ALARM");
                context.startService(stopIntent);
            } catch (Throwable t) {
                Log.e(TAG, "Failed to trigger STOP_ALARM on BackgroundPollingService", t);
            }

            callbackContext.success();
            return true;

        } else if ("setLastProcessedChallan".equals(action)) {
            String lastProcessedChallan = args.getString(0);
            Log.d(TAG, "Saving lastProcessedChallan: " + lastProcessedChallan);
            prefs.edit().putString("lastProcessedChallan", lastProcessedChallan).apply();
            callbackContext.success();
            return true;

        } else if ("showTripAlert".equals(action)) {
            String tripId = args.getString(0);
            Log.d(TAG, "showTripAlert requested for tripId: " + tripId);

            // Send START_ALARM action to the already-running unified service — no new FGS start!
            try {
                Log.d(TAG, "Triggering START_ALARM action on BackgroundPollingService...");
                Intent alarmIntent = new Intent(context, BackgroundPollingService.class);
                alarmIntent.setAction("START_ALARM");
                alarmIntent.putExtra("tripId", tripId);
                context.startService(alarmIntent);
            } catch (Throwable t) {
                Log.e(TAG, "Failed to trigger START_ALARM on BackgroundPollingService", t);
            }

            callbackContext.success();
            return true;

        } else if ("stopTripAlert".equals(action)) {
            Log.d(TAG, "stopTripAlert requested.");
            // Send STOP_ALARM action to the unified service
            try {
                Log.d(TAG, "Triggering STOP_ALARM action on BackgroundPollingService...");
                Intent stopIntent = new Intent(context, BackgroundPollingService.class);
                stopIntent.setAction("STOP_ALARM");
                context.startService(stopIntent);
            } catch (Throwable t) {
                Log.e(TAG, "Failed to trigger STOP_ALARM on BackgroundPollingService", t);
            }
            callbackContext.success();
            return true;

        } else if ("setLanguage".equals(action)) {
            String language = args.getString(0);
            Log.d(TAG, "Setting language: " + language);
            prefs.edit().putString("language", language).apply();
            callbackContext.success();
            return true;
        } else if ("showFreeNotification".equals(action)) {
            try {
                String reason = args.getString(0);
                Log.d(TAG, "showFreeNotification requested. reason: " + reason);
                Intent serviceIntent = new Intent(context, BackgroundPollingService.class);
                serviceIntent.setAction("SHOW_FREE_NOTIFICATION");
                serviceIntent.putExtra("reason", reason);
                context.startService(serviceIntent);
            } catch (Throwable t) {
                Log.e(TAG, "Failed to trigger SHOW_FREE_NOTIFICATION on BackgroundPollingService", t);
            }
            callbackContext.success();
            return true;
        }

        Log.w(TAG, "Action not matched: '" + action + "'");
        return false;
    }
}
