package com.fleettrackon.terminal;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;
import androidx.core.content.ContextCompat;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.os.Build;

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

            // Reschedule pending reminders on device boot
            android.database.sqlite.SQLiteDatabase db = null;
            android.database.Cursor cursor = null;
            try {
                java.io.File dbFile = context.getDatabasePath("reminders.db");
                if (dbFile.exists()) {
                    db = android.database.sqlite.SQLiteDatabase.openOrCreateDatabase(dbFile.getPath(), null);
                    cursor = db.rawQuery("SELECT * FROM reminders WHERE status = 'Pending'", null);
                    if (cursor != null && cursor.moveToFirst()) {
                        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
                        if (alarmManager != null) {
                            int idIndex = cursor.getColumnIndex("id");
                            int clientNameIndex = cursor.getColumnIndex("client_name");
                            int typeIndex = cursor.getColumnIndex("reminder_type");
                            int remarkIndex = cursor.getColumnIndex("remark");
                            int dateIndex = cursor.getColumnIndex("reminder_date");
                            int timeIndex = cursor.getColumnIndex("reminder_time");

                            do {
                                String id = cursor.getString(idIndex);
                                String clientName = cursor.getString(clientNameIndex);
                                String reminderType = cursor.getString(typeIndex);
                                String remark = cursor.getString(remarkIndex);
                                String dateStr = cursor.getString(dateIndex); // yyyy-MM-dd
                                String timeStr = cursor.getString(timeIndex); // HH:mm

                                try {
                                    java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm");
                                    java.util.Date d = sdf.parse(dateStr + " " + timeStr);
                                    long epochMs = d.getTime();

                                    if (epochMs > System.currentTimeMillis()) {
                                        Intent alarmIntent = new Intent(context, ReminderReceiver.class);
                                        alarmIntent.setAction(ReminderReceiver.ACTION_TRIGGER_REMINDER);
                                        alarmIntent.putExtra("id", id);
                                        alarmIntent.putExtra("clientName", clientName);
                                        alarmIntent.putExtra("reminderType", reminderType);
                                        alarmIntent.putExtra("remark", remark);
                                        alarmIntent.putExtra("time", timeStr);

                                        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
                                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                                            flags |= PendingIntent.FLAG_IMMUTABLE;
                                        }
                                        PendingIntent pi = PendingIntent.getBroadcast(context, id.hashCode(), alarmIntent, flags);

                                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                                            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, epochMs, pi);
                                        } else {
                                            alarmManager.setExact(AlarmManager.RTC_WAKEUP, epochMs, pi);
                                        }
                                        Log.d(TAG, "Rescheduled boot alarm for reminder: " + id + " at " + epochMs);
                                    }
                                } catch (Throwable e) {
                                    Log.e(TAG, "Error rescheduling boot alarm", e);
                                }
                            } while (cursor.moveToNext());
                        }
                    }
                }
            } catch (Throwable t) {
                Log.e(TAG, "Error checking reminders DB on boot", t);
            } finally {
                if (cursor != null) cursor.close();
                if (db != null) db.close();
            }
        }
    }
}
