package com.fleettrackon.terminal;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

/**
 * STUB: TripAlarmService is now fully replaced by BackgroundPollingService.
 * All alarm functionality (ringtone, full-screen notification) is handled
 * directly inside BackgroundPollingService to avoid Android 14+ background
 * FGS start restrictions and 5-arg PendingIntent VerifyError crashes.
 *
 * This stub exists only to satisfy any lingering manifest entries.
 * It does nothing and is never actively started.
 */
public class TripAlarmService extends Service {

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d("TripAlarmService", "Stub service started - ignoring (use BackgroundPollingService instead)");
        stopSelf(); // Immediately stop to avoid FGS start-not-called exceptions
        return START_NOT_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
