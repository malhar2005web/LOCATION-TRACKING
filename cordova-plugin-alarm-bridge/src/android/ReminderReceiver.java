package com.fleettrackon.terminal;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.database.sqlite.SQLiteDatabase;
import android.os.Build;
import android.util.Log;
import androidx.core.app.NotificationCompat;
import com.locationtracker.app.MainActivity;
import java.io.File;

public class ReminderReceiver extends BroadcastReceiver {
    private static final String TAG = "ReminderReceiver";
    public static final String ACTION_TRIGGER_REMINDER = "com.fleettrackon.terminal.ACTION_TRIGGER_REMINDER";
    public static final String ACTION_COMPLETE_REMINDER = "com.fleettrackon.terminal.ACTION_COMPLETE_REMINDER";
    public static final String ACTION_SNOOZE_REMINDER = "com.fleettrackon.terminal.ACTION_SNOOZE_REMINDER";

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        Log.d(TAG, "onReceive action=" + action);

        if (action == null) return;

        String id = intent.getStringExtra("id");
        String clientName = intent.getStringExtra("clientName");
        String reminderType = intent.getStringExtra("reminderType");
        String remark = intent.getStringExtra("remark");
        String time = intent.getStringExtra("time");

        if (id == null) return;

        int notifId = id.hashCode();

        if (ACTION_TRIGGER_REMINDER.equals(action)) {
            // Trigger Notification
            showNotification(context, id, clientName, reminderType, remark, time);
        } else if (ACTION_COMPLETE_REMINDER.equals(action)) {
            // Mark Completed in SQLite
            updateStatusInDb(context, id, "Completed");
            cancelNotification(context, notifId);
            Log.d(TAG, "Completed reminder: " + id);
        } else if (ACTION_SNOOZE_REMINDER.equals(action)) {
            // Snooze for 10 minutes (600,000 ms)
            snoozeReminder(context, id, clientName, reminderType, remark, time);
            cancelNotification(context, notifId);
            Log.d(TAG, "Snoozed reminder: " + id);
        }
    }

    private void showNotification(Context context, String id, String clientName, String reminderType, String remark, String time) {
        createNotificationChannel(context);

        // Click action: brings app to foreground
        Intent contentIntent = new Intent(context, MainActivity.class);
        contentIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent contentPI = PendingIntent.getActivity(
            context, id.hashCode(), contentIntent, getPendingIntentFlags(PendingIntent.FLAG_UPDATE_CURRENT)
        );

        // Mark Completed action
        Intent completeIntent = new Intent(context, ReminderReceiver.class);
        completeIntent.setAction(ACTION_COMPLETE_REMINDER);
        completeIntent.putExtra("id", id);
        PendingIntent completePI = PendingIntent.getBroadcast(
            context, id.hashCode() + 1, completeIntent, getPendingIntentFlags(PendingIntent.FLAG_UPDATE_CURRENT)
        );

        // Snooze action
        Intent snoozeIntent = new Intent(context, ReminderReceiver.class);
        snoozeIntent.setAction(ACTION_SNOOZE_REMINDER);
        snoozeIntent.putExtra("id", id);
        snoozeIntent.putExtra("clientName", clientName);
        snoozeIntent.putExtra("reminderType", reminderType);
        snoozeIntent.putExtra("remark", remark);
        snoozeIntent.putExtra("time", time);
        PendingIntent snoozePI = PendingIntent.getBroadcast(
            context, id.hashCode() + 2, snoozeIntent, getPendingIntentFlags(PendingIntent.FLAG_UPDATE_CURRENT)
        );

        String title = reminderType + " Reminder";
        String contentText = "Client: " + clientName + " | Time: " + time;
        String bigText = "Client: " + clientName + "\nType: " + reminderType + "\nTime: " + time + "\nRemark: " + remark;

        Notification notification = new NotificationCompat.Builder(context, "reminders_channel")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(contentText)
            .setStyle(new NotificationCompat.BigTextStyle().bigText(bigText))
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setContentIntent(contentPI)
            .addAction(android.R.drawable.ic_menu_save, "Complete", completePI)
            .addAction(android.R.drawable.ic_menu_recent_history, "Snooze (10m)", snoozePI)
            .setAutoCancel(true)
            .setDefaults(NotificationCompat.DEFAULT_ALL)
            .build();

        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) {
            nm.notify(id.hashCode(), notification);
        }
    }

    private void snoozeReminder(Context context, String id, String clientName, String reminderType, String remark, String time) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;

        Intent alarmIntent = new Intent(context, ReminderReceiver.class);
        alarmIntent.setAction(ACTION_TRIGGER_REMINDER);
        alarmIntent.putExtra("id", id);
        alarmIntent.putExtra("clientName", clientName);
        alarmIntent.putExtra("reminderType", reminderType);
        alarmIntent.putExtra("remark", remark);
        alarmIntent.putExtra("time", time);

        PendingIntent pi = PendingIntent.getBroadcast(
            context, id.hashCode(), alarmIntent, getPendingIntentFlags(PendingIntent.FLAG_UPDATE_CURRENT)
        );

        long triggerAtMillis = System.currentTimeMillis() + 600000; // 10 minutes
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAtMillis, pi);
        } else {
            alarmManager.setExact(AlarmManager.RTC_WAKEUP, triggerAtMillis, pi);
        }
    }

    private void updateStatusInDb(Context context, String id, String status) {
        SQLiteDatabase db = null;
        try {
            File dbFile = context.getDatabasePath("reminders.db");
            db = SQLiteDatabase.openOrCreateDatabase(dbFile.getPath(), null);
            db.execSQL(
                "UPDATE reminders SET status = ?, sync_status = 'Pending', updated_timestamp = ? WHERE id = ?",
                new Object[]{status, new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").format(new java.util.Date()), id}
            );
        } catch (Throwable t) {
            Log.e(TAG, "Error updating status in SQLite", t);
        } finally {
            if (db != null) {
                db.close();
            }
        }
    }

    private void cancelNotification(Context context, int notifId) {
        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) {
            nm.cancel(notifId);
        }
    }

    private void createNotificationChannel(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) {
                NotificationChannel channel = new NotificationChannel(
                    "reminders_channel", "Reminders Notification Channel", NotificationManager.IMPORTANCE_HIGH
                );
                channel.enableVibration(true);
                channel.enableLights(true);
                channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
                nm.createNotificationChannel(channel);
            }
        }
    }

    private int getPendingIntentFlags(int baseFlags) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return baseFlags | PendingIntent.FLAG_IMMUTABLE;
        }
        return baseFlags;
    }
}
