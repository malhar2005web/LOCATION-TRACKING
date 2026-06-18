package com.fleettrackon.terminal;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;
import androidx.core.content.ContextCompat;

public class BootReceiver extends BroadcastReceiver {
    private static final String TAG = "PCS_BootReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        Log.d(TAG, "Received boot intent action: " + action);

        if (Intent.ACTION_BOOT_COMPLETED.equals(action) || 
            "android.intent.action.QUICKBOOT_POWERON".equals(action)) {
            
            SharedPreferences prefs = context.getSharedPreferences("AlarmBridgePrefs", Context.MODE_PRIVATE);
            String vehicleId = prefs.getString("vehicleId", "");

            Log.d(TAG, "Vehicle ID from prefs: " + vehicleId);

            if (vehicleId != null && !vehicleId.trim().isEmpty()) {
                Log.d(TAG, "Starting BackgroundPollingService after device boot...");
                try {
                    Intent serviceIntent = new Intent(context, BackgroundPollingService.class);
                    ContextCompat.startForegroundService(context, serviceIntent);
                } catch (Throwable t) {
                    Log.e(TAG, "Failed to start BackgroundPollingService on boot", t);
                }
            } else {
                Log.d(TAG, "No vehicle ID registered. Skipping autostart.");
            }
        }
    }
}
