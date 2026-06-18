package com.fleettrackon.terminal;

import com.locationtracker.app.MainActivity;
import android.app.*;
import android.content.Intent;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.ServiceInfo;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.IBinder;
import android.os.Handler;
import android.os.Looper;
import android.os.PowerManager;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.util.Log;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.OutputStream;
import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLSession;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.content.pm.PackageManager;
import androidx.core.content.ContextCompat;

public class BackgroundPollingService extends Service {
    private static final String TAG = "BG_PollingService";
    private static final String ACTION_START_ALARM = "START_ALARM";
    private static final String ACTION_STOP_ALARM = "STOP_ALARM";
    private static final int NOTIF_ID_BG = 102;
    private static final int NOTIF_ID_ALARM = 103;

    private Handler handler;
    private Runnable runnable;
    private Ringtone ringtone;
    private MediaPlayer mediaPlayer;
    private PowerManager.WakeLock wakeLock;
    private static final int POLLING_INTERVAL = 10000; // 10 seconds
    private LocationManager locationManager;
    private LocationListener locationListener;
    private Location lastLocation;
    private long lastLocationSendTime = 0;

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "Background Polling Service created");

        // Native background location updates registration
        try {
            locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
            locationListener = new LocationListener() {
                @Override
                public void onLocationChanged(Location location) {
                    lastLocation = location;
                    Log.d(TAG, "Native background Location changed: " + location.getLatitude() + ", " + location.getLongitude());
                }
                @Override
                public void onStatusChanged(String provider, int status, Bundle extras) {}
                @Override
                public void onProviderEnabled(String provider) {}
                @Override
                public void onProviderDisabled(String provider) {}
            };

            if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                    locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 10000, 5, locationListener);
                }
                if (locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
                    locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 10000, 5, locationListener);
                }
                Log.d(TAG, "Registered native location updates successfully");
            } else {
                Log.w(TAG, "ACCESS_FINE_LOCATION permission not granted for background location tracking.");
            }
        } catch (Throwable t) {
            Log.e(TAG, "Failed to start native background location updates", t);
        }

        // Acquire partial WakeLock to keep CPU running when screen is off
        try {
            PowerManager powerManager = (PowerManager) getSystemService(Context.POWER_SERVICE);
            if (powerManager != null) {
                wakeLock = powerManager.newWakeLock(
                    PowerManager.PARTIAL_WAKE_LOCK,
                    "PCS:PollingWakeLock"
                );
                // Acquire with a 6-hour timeout to prevent indefinite lock (Android may strip unbounded locks)
                wakeLock.acquire(6 * 60 * 60 * 1000L);
                Log.d(TAG, "Partial WakeLock acquired successfully (6h timeout)");
            }
        } catch (Throwable t) {
            Log.e(TAG, "Failed to acquire WakeLock", t);
        }

        createChannels();

        // Build a simple low-priority standby notification using a guaranteed system icon
        Notification notification = buildStandbyNotification();

        try {
            if (Build.VERSION.SDK_INT >= 34) {
                startForeground(NOTIF_ID_BG, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE);
            } else {
                startForeground(NOTIF_ID_BG, notification);
            }
        } catch (Throwable t) {
            Log.e(TAG, "Failed to startForeground BackgroundPollingService", t);
        }

        handler = new Handler(Looper.getMainLooper());
        runnable = new Runnable() {
            @Override
            public void run() {
                pollLiveTrip();
                sendNativeLocationUpdate();
                
                // Dynamic polling: 1 minute (60,000 ms) always
                long nextInterval = 60000L;
                
                handler.postDelayed(this, nextInterval);
            }
        };
        handler.post(runnable);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            String action = intent.getAction();
            if (ACTION_START_ALARM.equals(action)) {
                String tripId = intent.getStringExtra("tripId");
                if (tripId == null) tripId = "";
                triggerAlarmNotification(tripId);
                playAlarm();
            } else if (ACTION_STOP_ALARM.equals(action)) {
                stopAlarm();
                cancelAlarmNotification();
            } else if ("SHOW_FREE_NOTIFICATION".equals(action)) {
                String reason = intent.getStringExtra("reason");
                showFreeNotification(reason);
            }
        }
        return START_STICKY;
    }

    /**
     * Critical: Re-start the service when user swipes app from recents.
     * This ensures the background polling keeps running even after task removal.
     */
    @Override
    public void onTaskRemoved(Intent rootIntent) {
        Log.d(TAG, "App swiped from recents — scheduling service restart...");
        try {
            Intent restartServiceIntent = new Intent(getApplicationContext(), BackgroundPollingService.class);
            restartServiceIntent.setPackage(getPackageName());

            int piFlags = PendingIntent.FLAG_ONE_SHOT;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                piFlags |= PendingIntent.FLAG_IMMUTABLE;
            }
            PendingIntent restartServicePI = PendingIntent.getService(
                getApplicationContext(), 999, restartServiceIntent, piFlags
            );

            AlarmManager alarmManager = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
            if (alarmManager != null) {
                alarmManager.set(AlarmManager.ELAPSED_REALTIME_WAKEUP, 
                    android.os.SystemClock.elapsedRealtime() + 3000, restartServicePI);
            }
        } catch (Throwable t) {
            Log.e(TAG, "Failed to schedule service restart on task removal", t);
        }
        super.onTaskRemoved(rootIntent);
    }

    // ─── Polling ─────────────────────────────────────────────────────────────

    private void pollLiveTrip() {
        final SharedPreferences prefs = getSharedPreferences("AlarmBridgePrefs", Context.MODE_PRIVATE);
        final String vehicleId = prefs.getString("vehicleId", "");
        final String acceptedChallan = prefs.getString("acceptedChallan", "");
        final String lastProcessedChallan = prefs.getString("lastProcessedChallan", "");

        Log.d(TAG, "pollLiveTrip triggered. Current vehicleId: '" + vehicleId + "', acceptedChallan: '" + acceptedChallan + "', lastProcessedChallan: '" + lastProcessedChallan + "'");

        if (vehicleId.isEmpty()) {
            Log.w(TAG, "Cannot poll LiveTrip: Vehicle ID is empty. Skipping background poll.");
            return;
        }

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Log.d(TAG, "Background thread started. Connecting to https://fleettrackon.co.in/skyway/LiveTrip for vehicle: " + vehicleId);
                    URL url = new URL("https://fleettrackon.co.in/skyway/LiveTrip");
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    
                    // Bypass SSL trust checks to guarantee background alerts function 100% on older tablets with outdated trust stores
                    if (conn instanceof HttpsURLConnection) {
                        Log.d(TAG, "Bypassing SSL checks for older devices...");
                        HttpsURLConnection httpsConn = (HttpsURLConnection) conn;
                        try {
                            TrustManager[] trustAllCerts = new TrustManager[]{
                                new X509TrustManager() {
                                    public X509Certificate[] getAcceptedIssuers() { return null; }
                                    public void checkClientTrusted(X509Certificate[] certs, String authType) {}
                                    public void checkServerTrusted(X509Certificate[] certs, String authType) {}
                                }
                            };
                            SSLContext sc = SSLContext.getInstance("SSL");
                            sc.init(null, trustAllCerts, new SecureRandom());
                            httpsConn.setSSLSocketFactory(sc.getSocketFactory());
                            httpsConn.setHostnameVerifier(new HostnameVerifier() {
                                public boolean verify(String hostname, SSLSession session) { return true; }
                            });
                            Log.d(TAG, "SSL trust manager bypass configured successfully.");
                        } catch (Exception e) {
                            Log.e(TAG, "Failed to bypass SSL socket factory", e);
                        }
                    }

                    conn.setRequestMethod("POST");
                    conn.setRequestProperty("Content-Type", "application/json");
                    conn.setDoOutput(true);
                    conn.setDoInput(true);
                    conn.setConnectTimeout(8000);
                    conn.setReadTimeout(8000);

                    JSONObject body = new JSONObject();
                    body.put("vehicleid", vehicleId);

                    Log.d(TAG, "Sending request body: " + body.toString());
                    OutputStream os = conn.getOutputStream();
                    os.write(body.toString().getBytes("UTF-8"));
                    os.close();

                    int responseCode = conn.getResponseCode();
                    Log.d(TAG, "HTTP Response Code: " + responseCode);
                    
                    if (responseCode == 200) {
                        InputStream is = conn.getInputStream();
                        ByteArrayOutputStream baos = new ByteArrayOutputStream();
                        byte[] buffer = new byte[1024];
                        int length;
                        while ((length = is.read(buffer)) != -1) {
                            baos.write(buffer, 0, length);
                        }
                        String responseStr = baos.toString("UTF-8");
                        is.close();

                        Log.d(TAG, "Received HTTP 200. Polling response: " + responseStr);
                        JSONObject res = new JSONObject(responseStr);
                        
                        if (res.has("trackerid")) {
                            JSONArray arr = res.getJSONArray("trackerid");
                            Log.d(TAG, "Found 'trackerid' array with length: " + arr.length());
                            
                            if (arr.length() > 0) {
                                JSONObject live = arr.getJSONObject(0);
                                String site = live.has("site") ? live.getString("site") : "";
                                String challanno = live.has("challanno") ? live.getString("challanno") : "";
                                Log.d(TAG, "Parsed first trip: site='" + site + "', challanno='" + challanno + "'");

                                if (!site.isEmpty() && !site.equals("---") && !site.toLowerCase().contains("waiting")) {
                                    Log.d(TAG, "Trip site is active and non-waiting. Checking challanno difference...");
                                    if (!challanno.isEmpty() && !challanno.equals(acceptedChallan) && !challanno.equals(lastProcessedChallan)) {
                                        Log.i(TAG, "NEW ACTIVE TRIP DETECTED! Site: " + site + ", Challan: " + challanno + " (Last processed was: " + lastProcessedChallan + "). Launching alarm flow...");
                                        final String finalChallan = challanno;
                                        final String finalSite = site;
                                        final String finalDriver = live.has("drname") ? live.getString("drname") : 
                                                                   (live.has("drivername") ? live.getString("drivername") : "Driver");
                                        new Handler(Looper.getMainLooper()).post(new Runnable() {
                                            @Override
                                            public void run() {
                                                Log.d(TAG, "Posting triggerAlarmNotification + playAlarm to main thread handler");
                                                triggerAlarmNotification(finalChallan, finalSite, finalDriver);
                                                playAlarm();
                                                vibrateDevice();
                                            }
                                        });
                                    } else {
                                        Log.d(TAG, "Challan '" + challanno + "' skipped. acceptedChallan='" + acceptedChallan + "', lastProcessedChallan='" + lastProcessedChallan + "'.");
                                    }
                                } else {
                                    Log.d(TAG, "Site status indicates standby/waiting. Clearing accepted challan if set.");
                                    final boolean wasActive = !acceptedChallan.isEmpty();
                                    prefs.edit().putString("acceptedChallan", "").apply();
                                    new Handler(Looper.getMainLooper()).post(new Runnable() {
                                        @Override
                                        public void run() {
                                            Log.d(TAG, "MainThread: Stopping alarm because site is empty/standby. wasActive = " + wasActive);
                                            stopAlarm();
                                            cancelAlarmNotification();
                                            if (wasActive) {
                                                Log.d(TAG, "Showing free notification (reason=admin) since wasActive was true");
                                                showFreeNotification("admin");
                                            }
                                        }
                                    });
                                }
                            } else {
                                Log.d(TAG, "trackerid array is empty. Clearing accepted challan if set.");
                                final boolean wasActive = !acceptedChallan.isEmpty();
                                prefs.edit().putString("acceptedChallan", "").apply();
                                new Handler(Looper.getMainLooper()).post(new Runnable() {
                                    @Override
                                    public void run() {
                                        Log.d(TAG, "MainThread: Stopping alarm because trackerid array is empty. wasActive = " + wasActive);
                                        stopAlarm();
                                        cancelAlarmNotification();
                                        if (wasActive) {
                                            Log.d(TAG, "Showing free notification (reason=admin) since wasActive was true");
                                            showFreeNotification("admin");
                                        }
                                    }
                                });
                            }
                        } else {
                            Log.w(TAG, "Response JSON does not contain 'trackerid' field. Clearing accepted challan.");
                            final boolean wasActive = !acceptedChallan.isEmpty();
                            prefs.edit().putString("acceptedChallan", "").apply();
                            new Handler(Looper.getMainLooper()).post(new Runnable() {
                                @Override
                                public void run() {
                                    Log.d(TAG, "MainThread: Stopping alarm because 'trackerid' is missing. wasActive = " + wasActive);
                                    stopAlarm();
                                    cancelAlarmNotification();
                                    if (wasActive) {
                                        Log.d(TAG, "Showing free notification (reason=admin) since wasActive was true");
                                        showFreeNotification("admin");
                                    }
                                }
                            });
                        }
                    } else {
                        Log.e(TAG, "Received non-200 HTTP response: " + responseCode);
                    }
                } catch (Throwable t) {
                    Log.e(TAG, "Exception occurred during LiveTrip polling request", t);
                }
            }
        }).start();
    }

    // ─── Alarm Control ────────────────────────────────────────────────────────

    private void playAlarm() {
        try {
            if ((mediaPlayer != null && mediaPlayer.isPlaying()) || (ringtone != null && ringtone.isPlaying())) {
                return; // already ringing
            }
            int resId = getResources().getIdentifier("alarm", "raw", getPackageName());
            if (resId != 0) {
                Log.d(TAG, "Found custom raw alarm sound resource. Initializing MediaPlayer...");
                mediaPlayer = MediaPlayer.create(this, resId);
                if (mediaPlayer != null) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        mediaPlayer.setAudioAttributes(
                            new AudioAttributes.Builder()
                                .setUsage(AudioAttributes.USAGE_MEDIA)
                                .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                                .build()
                        );
                    }
                    mediaPlayer.setLooping(true);
                    mediaPlayer.start();
                    Log.d(TAG, "Custom alarm sound started playing on MEDIA stream");
                    return; // Success! Skip default ringtone fallback.
                }
            }
        } catch (Throwable t) {
            Log.e(TAG, "Failed to play custom alarm via MediaPlayer, falling back to Ringtone", t);
        }

        // Fallback to default RingtoneManager ringtone if resource play failed or was not found
        try {
            Uri alert = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
            if (alert == null) alert = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE);
            if (alert == null) alert = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            if (alert != null) {
                ringtone = RingtoneManager.getRingtone(this, alert);
                if (ringtone != null) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        ringtone.setAudioAttributes(
                            new AudioAttributes.Builder()
                                .setUsage(AudioAttributes.USAGE_MEDIA)
                                .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                                .build()
                        );
                    }
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                        ringtone.setLooping(true);
                    }
                    ringtone.play();
                    Log.d(TAG, "Fallback alarm ringtone started playing on MEDIA audio stream");
                }
            }
        } catch (Throwable t) {
            Log.e(TAG, "Failed to play fallback alarm ringtone", t);
        }
    }

    private void vibrateDevice() {
        try {
            Vibrator vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
            if (vibrator != null && vibrator.hasVibrator()) {
                // Aggressive repeating pattern: vibrate 500ms, pause 300ms, repeat
                long[] pattern = {0, 500, 300, 500, 300, 500, 300, 1000};
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    vibrator.vibrate(VibrationEffect.createWaveform(pattern, 0)); // repeat from index 0
                } else {
                    vibrator.vibrate(pattern, 0);
                }
                Log.d(TAG, "Device vibration started");
            }
        } catch (Throwable t) {
            Log.e(TAG, "Failed to vibrate device", t);
        }
    }

    private void stopVibration() {
        try {
            Vibrator vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
            if (vibrator != null) {
                vibrator.cancel();
            }
        } catch (Throwable t) {
            Log.e(TAG, "Failed to stop vibration", t);
        }
    }

    private void stopAlarm() {
        try {
            if (mediaPlayer != null) {
                if (mediaPlayer.isPlaying()) {
                    mediaPlayer.stop();
                }
                mediaPlayer.release();
                mediaPlayer = null;
                Log.d(TAG, "Custom alarm MediaPlayer stopped and released");
            }
        } catch (Throwable t) {
            Log.e(TAG, "Failed to stop alarm MediaPlayer", t);
        }
        try {
            if (ringtone != null) {
                ringtone.stop();
                ringtone = null;
                Log.d(TAG, "Fallback alarm ringtone stopped");
            }
        } catch (Throwable t) {
            Log.e(TAG, "Failed to stop fallback alarm ringtone", t);
        }
        stopVibration();
    }

    // Overloaded: old single-arg method for compatibility with AlarmBridge showTripAlert
    private void triggerAlarmNotification(String tripId) {
        triggerAlarmNotification(tripId, "New Destination", "Driver");
    }

    private void triggerAlarmNotification(String challanNo, String site, String driverName) {
        try {
            // Acquire a temporary screen-on WakeLock to force the screen on even from Doze
            try {
                PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
                if (pm != null) {
                    PowerManager.WakeLock screenLock = pm.newWakeLock(
                        PowerManager.FULL_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP | PowerManager.ON_AFTER_RELEASE,
                        "PCS:AlarmScreenWake"
                    );
                    screenLock.acquire(30 * 1000L); // 30 second screen wake
                    Log.d(TAG, "Screen wake lock acquired for alarm notification");
                }
            } catch (Throwable t) {
                Log.e(TAG, "Failed to acquire screen wake lock", t);
            }

            // SHOW_ALARM intent — brings app to foreground and tells WebView to SHOW the alarm overlay
            // This does NOT stop the alarm! The alarm keeps ringing until the driver taps "Accept".
            Intent showAlarmIntent = new Intent(this, MainActivity.class);
            showAlarmIntent.setAction("SHOW_ALARM");
            showAlarmIntent.putExtra("tripId", challanNo);
            showAlarmIntent.putExtra("site", site);
            showAlarmIntent.putExtra("driverName", driverName);
            showAlarmIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);

            // Forcefully launch MainActivity directly to bypass notification suppression on custom ROMs (Car Players)
            try {
                startActivity(showAlarmIntent);
                Log.d(TAG, "Directly launched MainActivity with SHOW_ALARM from background service");
            } catch (Throwable t) {
                Log.e(TAG, "Failed to directly launch MainActivity from background service", t);
            }

            // ACCEPT_TRIP intent — used for notification tap only (stops alarm and accepts trip)
            Intent acceptIntent = new Intent(this, MainActivity.class);
            acceptIntent.setAction("ACCEPT_TRIP");
            acceptIntent.putExtra("tripId", challanNo);
            acceptIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);

            // Use the safe 4-argument PendingIntent — NO 5-arg API 34 version to avoid VerifyError on any ROM
            int piFlags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                piFlags |= PendingIntent.FLAG_IMMUTABLE;
            }
            PendingIntent fullScreenIntent = PendingIntent.getActivity(this, 1, acceptIntent, piFlags);

            // Get the system alarm sound URI for the notification itself
            Uri alarmSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
            if (alarmSound == null) alarmSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE);
            if (alarmSound == null) alarmSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);

            SharedPreferences prefs = getSharedPreferences("AlarmBridgePrefs", Context.MODE_PRIVATE);
            String lang = prefs.getString("language", "en");

            String translatedSite = translateChallanDetails(site, lang);
            String translatedChallan = translateChallanDetails(challanNo, lang);
            String translatedDriver = translateChallanDetails(driverName, lang);

            String title = "🚛 New Challan Assigned!";
            String content = "Destination: " + translatedSite + " | Challan: " + translatedChallan;
            String bigTextStr = "Driver: " + translatedDriver + "\nDestination: " + translatedSite + "\nChallan No: " + translatedChallan + "\n\nTap to accept and navigate.";

            if ("hi".equals(lang)) {
                title = "🚛 नया चालान सौंपा गया!";
                content = "गंतव्य स्थान: " + translatedSite + " | चालान: " + translatedChallan;
                bigTextStr = "ड्रायवर: " + translatedDriver + "\nगंतव्य स्थान: " + translatedSite + "\nचालान क्र: " + translatedChallan + "\n\nस्वीकार करने और नेविगेट करने के लिए टैप करें।";
            } else if ("mr".equals(lang)) {
                title = "🚛 नवीन चालान नियुक्त केले!";
                content = "गंतव्य स्थान: " + translatedSite + " | चालान: " + translatedChallan;
                bigTextStr = "ड्रायव्हर: " + translatedDriver + "\nगंतव्य स्थान: " + translatedSite + "\nचालान क्र: " + translatedChallan + "\n\nस्वीकार करण्यासाठी आणि नेविगेट करण्यासाठी टॅप करा।";
            }

            Notification alarmNotif = new NotificationCompat.Builder(this, "trip_alarm")
                    .setSmallIcon(android.R.drawable.ic_dialog_info)
                    .setContentTitle(title)
                    .setContentText(content)
                    .setStyle(new NotificationCompat.BigTextStyle()
                        .bigText(bigTextStr))
                    .setPriority(NotificationCompat.PRIORITY_MAX)
                    .setCategory(NotificationCompat.CATEGORY_ALARM)
                    .setFullScreenIntent(fullScreenIntent, true)
                    .setContentIntent(fullScreenIntent)
                    .setAutoCancel(true)
                    .setOngoing(true)
                    .setDefaults(NotificationCompat.DEFAULT_VIBRATE | NotificationCompat.DEFAULT_LIGHTS)
                    .setVisibility(NotificationCompat.VISIBILITY_PUBLIC) // Show on lock screen
                    .build();

            NotificationManagerCompat nm = NotificationManagerCompat.from(this);
            try {
                nm.notify(NOTIF_ID_ALARM, alarmNotif);
                Log.d(TAG, "High-priority alarm notification posted successfully");
            } catch (Throwable t) {
                Log.e(TAG, "Failed to post alarm notification", t);
            }
        } catch (Throwable t) {
            Log.e(TAG, "Failed to build alarm notification", t);
        }
    }

    private void cancelAlarmNotification() {
        try {
            NotificationManagerCompat.from(this).cancel(NOTIF_ID_ALARM);
        } catch (Throwable t) {
            Log.e(TAG, "Failed to cancel alarm notification", t);
        }
    }

    public void showFreeNotification(String reason) {
        try {
            SharedPreferences prefs = getSharedPreferences("AlarmBridgePrefs", Context.MODE_PRIVATE);
            String lang = prefs.getString("language", "en");

            String title = "🚛 Vehicle is Free";
            String content = "Vehicle status updated to standby.";

            if ("geofence".equals(reason)) {
                title = "🎯 Destination Reached";
                content = "You have arrived at the destination. Vehicle is free.";
                if ("hi".equals(lang)) {
                    title = "🎯 गंतव्य स्थान पर पहुंच गए!";
                    content = "आप गंतव्य स्थान पर पहुंच गए हैं। वाहन अब फ्री है।";
                } else if ("mr".equals(lang)) {
                    title = "🎯 गंतव्य स्थान गाठले!";
                    content = "आपण गंतव्य स्थानावर पोहोचला आहात. वाहन आता फ्री आहे.";
                }
            } else if ("admin".equals(reason)) {
                title = "✅ Trip Completed";
                content = "Completed by the admin.";
                if ("hi".equals(lang)) {
                    title = "✅ ट्रिप पूरी हो गई";
                    content = "एडमिन द्वारा पूरी की गई।";
                } else if ("mr".equals(lang)) {
                    title = "✅ ट्रिप पूर्ण झाली";
                    content = "अ‍ॅडमिनद्वारे पूर्ण केली गेली.";
                }
            }

            // Build standard dismissible notification (not ongoing, with default sound)
            NotificationCompat.Builder builder = new NotificationCompat.Builder(this, "trip_status")
                    .setSmallIcon(android.R.drawable.ic_dialog_info)
                    .setContentTitle(title)
                    .setContentText(content)
                    .setPriority(NotificationCompat.PRIORITY_HIGH)
                    .setDefaults(NotificationCompat.DEFAULT_SOUND | NotificationCompat.DEFAULT_VIBRATE)
                    .setAutoCancel(true);

            // Open MainActivity when clicked
            Intent openIntent = new Intent(this, MainActivity.class);
            openIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
            int piFlags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                piFlags |= PendingIntent.FLAG_IMMUTABLE;
            }
            PendingIntent openPI = PendingIntent.getActivity(this, 2, openIntent, piFlags);
            builder.setContentIntent(openPI);

            NotificationManagerCompat nm = NotificationManagerCompat.from(this);
            nm.notify(104, builder.build()); // NOTIF_ID_FREE = 104
            Log.d(TAG, "Showed free notification for reason: " + reason);
        } catch (Throwable t) {
            Log.e(TAG, "Failed to show free notification", t);
        }
    }

    // ─── Channel & Notification builders ─────────────────────────────────────

    private void createChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager nm = getSystemService(NotificationManager.class);
            if (nm == null) return;

            // Low-priority background monitor channel
            NotificationChannel bgChannel = new NotificationChannel(
                    "bg_polling", "Background Monitoring", NotificationManager.IMPORTANCE_LOW);
            nm.createNotificationChannel(bgChannel);

            // HIGH-IMPORTANCE alarm channel — this is the key to heads-up popover notifications!
            NotificationChannel alarmChannel = new NotificationChannel(
                    "trip_alarm", "Trip Alarm", NotificationManager.IMPORTANCE_HIGH);

            // Set vibration pattern for the channel itself
            alarmChannel.enableVibration(true);
            alarmChannel.setVibrationPattern(new long[]{0, 500, 300, 500, 300, 500});

            // Enable lights
            alarmChannel.enableLights(true);
            alarmChannel.setLightColor(0xFFFF6600); // Orange

            // Allow showing on lock screen
            alarmChannel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);

            // Set the channel to bypass DND (Do Not Disturb)
            alarmChannel.setBypassDnd(true);

            // Do NOT set a custom sound on the channel — we play the alarm ourselves via Ringtone API
            // to guarantee looping. Channel sounds only play once.
            alarmChannel.setSound(null, null);

            nm.createNotificationChannel(alarmChannel);

            // Status updates channel (High importance for audible alerts when free)
            NotificationChannel statusChannel = new NotificationChannel(
                    "trip_status", "Trip Status Updates", NotificationManager.IMPORTANCE_HIGH);
            statusChannel.enableVibration(true);
            statusChannel.enableLights(true);
            statusChannel.setLightColor(0xFF00FF00); // Green
            statusChannel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
            nm.createNotificationChannel(statusChannel);

            Log.d(TAG, "Notification channels created: bg_polling (LOW), trip_alarm (HIGH, bypassDND), trip_status (HIGH)");
        }
    }

    private Notification buildStandbyNotification() {
        return new NotificationCompat.Builder(this, "bg_polling")
                .setSmallIcon(android.R.drawable.ic_menu_mylocation)
                .setContentTitle("PCS Tracking Active")
                .setContentText("Listening for new challans...")
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setAutoCancel(false)
                .setOngoing(true)
                .build();
    }

    @Override
    public void onDestroy() {
        stopAlarm();
        if (handler != null && runnable != null) {
            handler.removeCallbacks(runnable);
        }
        if (locationManager != null && locationListener != null) {
            try {
                locationManager.removeUpdates(locationListener);
                Log.d(TAG, "Unregistered native location updates");
            } catch (Throwable t) {
                Log.e(TAG, "Failed to unregister native location updates", t);
            }
        }
        // Release WakeLock
        try {
            if (wakeLock != null && wakeLock.isHeld()) {
                wakeLock.release();
                Log.d(TAG, "WakeLock released");
            }
        } catch (Throwable t) {
            Log.e(TAG, "Failed to release WakeLock", t);
        }
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private String translateChallanDetails(String text, String lang) {
        if (text == null || text.isEmpty()) return text;
        if (lang == null || lang.equals("en")) return text;

        String lowerText = text.toLowerCase().trim();
        
        // Exact dictionary matching
        if (lang.equals("hi")) {
            if ("near bombay art gallery soc,bandra".equals(lowerText) || "near bombay art gallery soc, bandra".equals(lowerText)) return "बॉम्बे आर्ट गैलरी सोसायटी के पास, बांद्रा";
            if ("shrim bhanu construction pvt ltd".equals(lowerText)) return "श्रीम भानू कंस्ट्रक्शन प्रा. लि.";
            if ("shrim bhanu construction".equals(lowerText)) return "श्रीम भानू कंस्ट्रक्शन";
            if ("star shine".equals(lowerText)) return "स्टार शाइन";
            if ("sayba badr kurla west".equals(lowerText)) return "सायबा बदर कुर्ला वेस्ट";
            if ("sayba badr".equals(lowerText)) return "सायबा बदर";
            if ("kurla west".equals(lowerText)) return "कुर्ला वेस्ट";
            if ("kurla".equals(lowerText)) return "कुर्ला";
            if ("west".equals(lowerText)) return "वेस्ट";
            if ("road".equals(lowerText)) return "रोड";
            if ("rd".equals(lowerText)) return "रोड";
            if ("navghar".equals(lowerText)) return "नवघर";
            if ("navghar rd".equals(lowerText)) return "नवघर रोड";
            if ("concrete mix".equals(lowerText)) return "कंक्रीट मिक्स";
            if ("waiting for admin...".equals(lowerText)) return "एडमिन की प्रतीक्षा है...";
        } else if (lang.equals("mr")) {
            if ("near bombay art gallery soc,bandra".equals(lowerText) || "near bombay art gallery soc, bandra".equals(lowerText)) return "मुंबई आर्ट गॅलरी सोसायटी जवळ, वांद्रे";
            if ("shrim bhanu construction pvt ltd".equals(lowerText)) return "श्रीम भानू कन्स्ट्रक्शन प्रा. लि.";
            if ("shrim bhanu construction".equals(lowerText)) return "श्रीम भानू कन्स्ट्रक्शन";
            if ("star shine".equals(lowerText)) return "स्टार शाइन";
            if ("sayba badr kurla west".equals(lowerText)) return "सायबा बदर कुर्ला वेस्ट";
            if ("sayba badr".equals(lowerText)) return "सायबा बदर";
            if ("kurla west".equals(lowerText)) return "कुर्ला वेस्ट";
            if ("kurla".equals(lowerText)) return "कुर्ला";
            if ("west".equals(lowerText)) return "वेस्ट";
            if ("road".equals(lowerText)) return "रोड";
            if ("rd".equals(lowerText)) return "रोड";
            if ("navghar".equals(lowerText)) return "नवघर";
            if ("navghar rd".equals(lowerText)) return "नवघर रोड";
            if ("concrete mix".equals(lowerText)) return "काँक्रीट मिक्स";
            if ("waiting for admin...".equals(lowerText)) return "अ‍ॅडमिनची प्रतीक्षा आहे...";
        }

        // Try partial replacement for common words, ordered by descending key length
        String translatedText = text;
        String[][] replacements;
        if (lang.equals("hi")) {
            replacements = new String[][]{
                {"near bombay art gallery soc,bandra", "बॉम्बे आर्ट गैलरी सोसायटी के पास, बांद्रा"},
                {"near bombay art gallery soc, bandra", "बॉम्बे आर्ट गैलरी सोसायटी के पास, बांद्रा"},
                {"shrim bhanu construction pvt ltd", "श्रीम भानू कंस्ट्रक्शन प्रा. लि."},
                {"shrim bhanu construction", "श्रीम भानू कंस्ट्रक्शन"},
                {"sayba badr kurla west", "सायबा बदर कुर्ला वेस्ट"},
                {"waiting for admin...", "एडमिन की प्रतीक्षा है..."},
                {"bombay art gallery", "बॉम्बे आर्ट गैलरी"},
                {"sayba badr", "सायबा बदर"},
                {"kurla west", "कुर्ला वेस्ट"},
                {"concrete mix", "कंक्रीट मिक्स"},
                {"construction", "कंस्ट्रक्शन"},
                {"constructions", "कंस्ट्रक्शन"},
                {"art gallery", "आर्ट गैलरी"},
                {"navghar rd", "नवघर रोड"},
                {"star shine", "स्टार शाइन"},
                {"navghar", "नवघर"},
                {"gallery", "गैलरी"},
                {"society", "सोसायटी"},
                {"private", "प्राइवेट"},
                {"limited", "लिमिटेड"},
                {"bombay", "बॉम्बे"},
                {"bandra", "बांद्रा"},
                {"shrim", "श्रीम"},
                {"bhanu", "भानू"},
                {"kurla", "कुर्ला"},
                {"west", "वेस्ट"},
                {"east", "ईस्ट"},
                {"road", "रोड"},
                {"near", "के पास"},
                {"star", "स्टार"},
                {"ltd", "लि."},
                {"pvt", "प्रा. लि."},
                {"art", "आर्ट"},
                {"soc", "सोसायटी"},
                {"mix", "मिक्स"},
                {"rd", "रोड"}
            };
        } else { // mr
            replacements = new String[][]{
                {"near bombay art gallery soc,bandra", "मुंबई आर्ट गॅलरी सोसायटी जवळ, वांद्रे"},
                {"near bombay art gallery soc, bandra", "मुंबई आर्ट गॅलरी सोसायटी जवळ, वांद्रे"},
                {"shrim bhanu construction pvt ltd", "श्रीम भानू कन्स्ट्रक्शन प्रा. लि."},
                {"shrim bhanu construction", "श्रीम भानू कन्स्ट्रक्शन"},
                {"sayba badr kurla west", "सायबा बदर कुर्ला वेस्ट"},
                {"waiting for admin...", "अ‍ॅडमिनची प्रतीक्षा आहे..."},
                {"bombay art gallery", "मुंबई आर्ट गॅलरी"},
                {"sayba badr", "सायबा बदर"},
                {"kurla west", "कुर्ला वेस्ट"},
                {"concrete mix", "काँक्रीट मिक्स"},
                {"construction", "कन्स्ट्रक्शन"},
                {"constructions", "कन्स्ट्रक्शन"},
                {"art gallery", "आर्ट गॅलरी"},
                {"navghar rd", "नवघर रोड"},
                {"star shine", "स्टार शाइन"},
                {"navghar", "नवघर"},
                {"gallery", "गॅलरी"},
                {"society", "सोसायटी"},
                {"private", "प्रायव्हेट"},
                {"limited", "लिमिटेड"},
                {"bombay", "मुंबई"},
                {"bandra", "वांद्रे"},
                {"shrim", "श्रीम"},
                {"bhanu", "भानू"},
                {"kurla", "कुर्ला"},
                {"west", "वेस्ट"},
                {"east", "ईस्ट"},
                {"road", "रोड"},
                {"near", "जवळ"},
                {"star", "स्टार"},
                {"ltd", "लि."},
                {"pvt", "प्रा. लि."},
                {"art", "आर्ट"},
                {"soc", "सोसायटी"},
                {"mix", "काँक्रीट मिक्स"},
                {"rd", "रोड"}
            };
        }

        for (String[] pair : replacements) {
            String regex = "(?i)\\b" + pair[0] + "\\b";
            translatedText = translatedText.replaceAll(regex, pair[1]);
        }

        return translatedText;
    }

    private void sendNativeLocationUpdate() {
        final SharedPreferences prefs = getSharedPreferences("AlarmBridgePrefs", Context.MODE_PRIVATE);
        final String truckNumber = prefs.getString("truckNumber", "");
        
        if (truckNumber.isEmpty()) {
            Log.d(TAG, "sendNativeLocationUpdate: No truck number stored. Skipping location update.");
            return;
        }

        long now = System.currentTimeMillis();
        long trackingInterval = 60000L; // 1 minute for testing, change to 900000L (15 mins) for production
        if (now - lastLocationSendTime < trackingInterval) {
            return;
        }

        lastLocationSendTime = now;
        Log.d(TAG, "sendNativeLocationUpdate: Fetching position for " + truckNumber);

        Location loc = lastLocation;
        if (loc == null && locationManager != null) {
            try {
                if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                        loc = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                    }
                    if (loc == null && locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
                        loc = locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
                    }
                }
            } catch (Throwable t) {
                Log.e(TAG, "Error getting last known location", t);
            }
        }

        if (loc != null) {
            double lat = loc.getLatitude();
            double lon = loc.getLongitude();
            long time = loc.getTime();
            Log.i(TAG, "Posting background location: " + lat + ", " + lon + " (time=" + time + ")");
            postTrackingLocation(truckNumber, lat, lon, time);
        } else {
            Log.w(TAG, "No background location available to post");
        }
    }

    private void postTrackingLocation(final String truckNumber, final double lat, final double lon, final long time) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    URL url = new URL("https://fleettrackon.co.in/skyway/consoletracking");
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    
                    if (conn instanceof HttpsURLConnection) {
                        HttpsURLConnection httpsConn = (HttpsURLConnection) conn;
                        try {
                            TrustManager[] trustAllCerts = new TrustManager[]{
                                new X509TrustManager() {
                                    public X509Certificate[] getAcceptedIssuers() { return null; }
                                    public void checkClientTrusted(X509Certificate[] certs, String authType) {}
                                    public void checkServerTrusted(X509Certificate[] certs, String authType) {}
                                }
                            };
                            SSLContext sc = SSLContext.getInstance("SSL");
                            sc.init(null, trustAllCerts, new SecureRandom());
                            httpsConn.setSSLSocketFactory(sc.getSocketFactory());
                            httpsConn.setHostnameVerifier(new HostnameVerifier() {
                                public boolean verify(String hostname, SSLSession session) { return true; }
                            });
                        } catch (Exception e) {
                            Log.e(TAG, "Failed to bypass SSL for tracking", e);
                        }
                    }

                    conn.setRequestMethod("POST");
                    conn.setRequestProperty("Content-Type", "application/json");
                    conn.setDoOutput(true);
                    conn.setDoInput(true);
                    conn.setConnectTimeout(8000);
                    conn.setReadTimeout(8000);

                    // Format timestamp as ISO 8601 string
                    java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", java.util.Locale.US);
                    sdf.setTimeZone(java.util.TimeZone.getTimeZone("UTC"));
                    String isoTime = sdf.format(new java.util.Date(time));

                    JSONObject body = new JSONObject();
                    body.put("deviceId", truckNumber);
                    body.put("latitude", String.valueOf(lat));
                    body.put("longitude", String.valueOf(lon));
                    body.put("lastSeen", isoTime);
                    body.put("status", "Live");

                    Log.d(TAG, "Posting native location: " + body.toString());
                    OutputStream os = conn.getOutputStream();
                    os.write(body.toString().getBytes("UTF-8"));
                    os.close();

                    int responseCode = conn.getResponseCode();
                    Log.d(TAG, "Native location POST response code: " + responseCode);
                    if (responseCode == 200) {
                        InputStream is = conn.getInputStream();
                        ByteArrayOutputStream baos = new ByteArrayOutputStream();
                        byte[] buffer = new byte[1024];
                        int length;
                        while ((length = is.read(buffer)) != -1) {
                            baos.write(buffer, 0, length);
                        }
                        String responseStr = baos.toString("UTF-8");
                        is.close();
                        Log.d(TAG, "Native location POST response: " + responseStr);
                    }
                } catch (Throwable t) {
                    Log.e(TAG, "Exception during native location POST", t);
                }
            }
        }).start();
    }
}
