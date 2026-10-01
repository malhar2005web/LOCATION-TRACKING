#if ANDROID
using Android.App;
using Android.Content;
using Android.OS;
using AndroidX.Core.App;
using LocationTracker.Services.Gps;
using LocationTracker.Services.Api;
using LocationTracker.Services.Storage;
using System.Net.Http;
using System.Net.Http.Json;
using Microsoft.Maui.Devices.Sensors;

namespace LocationTracker.Platforms.Android
{
    [Service(Name = "com.locationtracker.app.AndroidBackgroundService", ForegroundServiceType = global::Android.Content.PM.ForegroundService.TypeLocation)]
    public class AndroidBackgroundService : Service, global::Android.Locations.ILocationListener
    {
        private const int ServiceNotificationId = 1001;
        private const string ChannelId = "LocationTrackingChannel";
        public const string ActionPulse = "com.locationtracker.app.ACTION_PULSE";

        private System.Threading.Timer _timer;
        private PowerManager.WakeLock _wakeLock;
        private global::Android.Locations.LocationManager _locationManager;
        private int _locationsSentCount = 0;
        private DateTime _lastSentTime = DateTime.MinValue;
        private readonly object _sendLock = new object();

        private static readonly object _pendingLock = new object();
        private static string PendingLocationsFilePath => Path.Combine(System.Environment.GetFolderPath(System.Environment.SpecialFolder.Personal), "pending_locations_queue.json");

        public static int LocationsSentCount { get; set; } = 0;
        public static double LastLatitude { get; set; } = 0.0;
        public static double LastLongitude { get; set; } = 0.0;
        public static string LastSyncTime { get; set; } = "Never";

        public static int PendingLocationsCount
        {
            get
            {
                lock (_pendingLock)
                {
                    try
                    {
                        if (!File.Exists(PendingLocationsFilePath)) return 0;
                        var json = File.ReadAllText(PendingLocationsFilePath);
                        if (string.IsNullOrWhiteSpace(json)) return 0;
                        var list = System.Text.Json.JsonSerializer.Deserialize<List<string>>(json);
                        return list?.Count ?? 0;
                    }
                    catch
                    {
                        return 0;
                    }
                }
            }
        }

        public static void SavePendingLocation(string payloadJson)
        {
            lock (_pendingLock)
            {
                try
                {
                    List<string> list = new List<string>();
                    if (File.Exists(PendingLocationsFilePath))
                    {
                        var existingJson = File.ReadAllText(PendingLocationsFilePath);
                        if (!string.IsNullOrWhiteSpace(existingJson))
                        {
                            list = System.Text.Json.JsonSerializer.Deserialize<List<string>>(existingJson) ?? new List<string>();
                        }
                    }
                    list.Add(payloadJson);
                    if (list.Count > 1000)
                    {
                        list.RemoveRange(0, list.Count - 1000);
                    }
                    File.WriteAllText(PendingLocationsFilePath, System.Text.Json.JsonSerializer.Serialize(list));
                    GpsDiagnostics.Log($"[Offline Storage] Saved offline location. Total pending: {list.Count}");
                }
                catch (Exception ex)
                {
                    GpsDiagnostics.Log($"[Offline Storage] Error saving location: {ex.Message}");
                }
            }
        }

        public static async Task FlushPendingLocationsAsync(HttpClient client)
        {
            List<string> itemsToFlush;
            lock (_pendingLock)
            {
                try
                {
                    if (!File.Exists(PendingLocationsFilePath)) return;
                    var json = File.ReadAllText(PendingLocationsFilePath);
                    if (string.IsNullOrWhiteSpace(json)) return;
                    itemsToFlush = System.Text.Json.JsonSerializer.Deserialize<List<string>>(json);
                    if (itemsToFlush == null || itemsToFlush.Count == 0) return;
                }
                catch
                {
                    return;
                }
            }

            if (itemsToFlush == null || itemsToFlush.Count == 0) return;
            GpsDiagnostics.Log($"[Offline Storage] Flushing {itemsToFlush.Count} pending offline locations...");

            var remaining = new List<string>(itemsToFlush);
            int flushedCount = 0;

            foreach (var itemJson in itemsToFlush)
            {
                try
                {
                    var content = new StringContent(itemJson, System.Text.Encoding.UTF8, "application/json");
                    var res = await client.PostAsync("https://fleettrackon.co.in/pcsdia/receiveddata", content);
                    if (res.IsSuccessStatusCode)
                    {
                        remaining.Remove(itemJson);
                        flushedCount++;
                    }
                    else
                    {
                        break;
                    }
                }
                catch
                {
                    break;
                }
            }

            lock (_pendingLock)
            {
                try
                {
                    if (remaining.Count > 0)
                    {
                        File.WriteAllText(PendingLocationsFilePath, System.Text.Json.JsonSerializer.Serialize(remaining));
                    }
                    else if (File.Exists(PendingLocationsFilePath))
                    {
                        File.Delete(PendingLocationsFilePath);
                    }
                }
                catch {}
            }

            if (flushedCount > 0)
            {
                LocationsSentCount += flushedCount;
                GpsDiagnostics.Log($"[Offline Storage] Flushed {flushedCount} locations. Remaining: {remaining.Count}");
            }
        }

        public override IBinder OnBind(Intent intent) => null;

        private void UpdateNotification(string text)
        {
            try
            {
                var iconId = ApplicationContext.ApplicationInfo.Icon;
                
                var intent = new Intent(this, typeof(LOCATION_TRACKING.MainActivity));
                intent.SetFlags(ActivityFlags.ClearTop | ActivityFlags.SingleTop);
                var flags = Build.VERSION.SdkInt >= BuildVersionCodes.M 
                    ? PendingIntentFlags.UpdateCurrent | PendingIntentFlags.Immutable 
                    : PendingIntentFlags.UpdateCurrent;
                var pendingIntent = PendingIntent.GetActivity(this, 0, intent, flags);

                var notification = new NotificationCompat.Builder(this, ChannelId)
                    .SetContentTitle("Location Tracking Active")
                    .SetContentText(text)
                    .SetSmallIcon(iconId)
                    .SetOngoing(true)
                    .SetCategory(NotificationCompat.CategoryService)
                    .SetPriority(NotificationCompat.PriorityHigh)
                    .SetContentIntent(pendingIntent)
                    .SetStyle(new NotificationCompat.BigTextStyle().BigText(text))
                    .Build();

                var manager = GetSystemService(NotificationService) as NotificationManager;
                manager?.Notify(ServiceNotificationId, notification);
            }
            catch (Exception ex)
            {
                GpsDiagnostics.Log($"UpdateNotification failed: {ex.Message}");
            }
        }

        public override StartCommandResult OnStartCommand(Intent intent, StartCommandFlags flags, int startId)
        {
            GpsDiagnostics.Log("OnStartCommand invoked.");
            try
            {
                CreateNotificationChannel();
                var iconId = ApplicationContext.ApplicationInfo.Icon;

                var clickIntent = new Intent(this, typeof(LOCATION_TRACKING.MainActivity));
                clickIntent.SetFlags(ActivityFlags.ClearTop | ActivityFlags.SingleTop);
                var clickFlags = Build.VERSION.SdkInt >= BuildVersionCodes.M 
                    ? PendingIntentFlags.UpdateCurrent | PendingIntentFlags.Immutable 
                    : PendingIntentFlags.UpdateCurrent;
                var pendingIntent = PendingIntent.GetActivity(this, 0, clickIntent, clickFlags);

                var notification = new NotificationCompat.Builder(this, ChannelId)
                    .SetContentTitle("Location Tracking Active")
                    .SetContentText("Continuous background tracking running...")
                    .SetSmallIcon(iconId)
                    .SetOngoing(true)
                    .SetCategory(NotificationCompat.CategoryService)
                    .SetPriority(NotificationCompat.PriorityHigh)
                    .SetContentIntent(pendingIntent)
                    .Build();

                if (_wakeLock == null)
                {
                    var powerManager = (PowerManager)GetSystemService(PowerService);
                    _wakeLock = powerManager.NewWakeLock(WakeLockFlags.Partial, "LocationTracker::BackgroundWakeLock");
                    _wakeLock.SetReferenceCounted(false);
                }
                if (!_wakeLock.IsHeld)
                {
                    _wakeLock.Acquire();
                    GpsDiagnostics.Log("Wake lock acquired.");
                }

                if (Build.VERSION.SdkInt >= BuildVersionCodes.Q)
                {
                    StartForeground(ServiceNotificationId, notification, global::Android.Content.PM.ForegroundService.TypeLocation);
                }
                else
                {
                    StartForeground(ServiceNotificationId, notification);
                }

                // Register continuous hardware location updates (keeps GPS provider active during sleep)
                RegisterContinuousLocationUpdates();
            }
            catch (Exception ex)
            {
                GpsDiagnostics.Log($"Failed to initialize foreground service properties: {ex.Message}\n{ex.StackTrace}");
            }

            // Always reschedule the Doze Mode Watchdog Alarm (Guarantees execution even past 1 hour)
            ScheduleNextAlarmWatchdog();

            // Check if this invocation is an Alarm Watchdog pulse
            if (intent != null && intent.Action == ActionPulse)
            {
                GpsDiagnostics.Log("[Watchdog] Alarm pulse triggered. Performing heartbeat check...");
                _ = TriggerLocationEvaluationAsync();
            }

            // Dispose and recreate 1-minute fallback timer
            _timer?.Dispose();
            _timer = new System.Threading.Timer(async _ =>
            {
                await TriggerLocationEvaluationAsync();
            }, null, TimeSpan.FromSeconds(10), TimeSpan.FromMinutes(1));

            return StartCommandResult.Sticky;
        }

        private void RegisterContinuousLocationUpdates()
        {
            try
            {
                if (_locationManager == null)
                {
                    _locationManager = (global::Android.Locations.LocationManager)GetSystemService(Context.LocationService);
                }

                if (_locationManager == null) return;

                // Remove existing updates to avoid duplicate callbacks
                _locationManager.RemoveUpdates(this);

                if (_locationManager.IsProviderEnabled(global::Android.Locations.LocationManager.GpsProvider))
                {
                    _locationManager.RequestLocationUpdates(
                        global::Android.Locations.LocationManager.GpsProvider,
                        minTimeMs: 60000,
                        minDistanceM: 0,
                        this,
                        Looper.MainLooper
                    );
                    GpsDiagnostics.Log("Continuous GPS provider listener registered.");
                }

                if (_locationManager.IsProviderEnabled(global::Android.Locations.LocationManager.NetworkProvider))
                {
                    _locationManager.RequestLocationUpdates(
                        global::Android.Locations.LocationManager.NetworkProvider,
                        minTimeMs: 60000,
                        minDistanceM: 0,
                        this,
                        Looper.MainLooper
                    );
                    GpsDiagnostics.Log("Continuous Network provider listener registered.");
                }
            }
            catch (Exception ex)
            {
                GpsDiagnostics.Log($"RegisterContinuousLocationUpdates failed: {ex.Message}");
            }
        }

        private void ScheduleNextAlarmWatchdog()
        {
            try
            {
                var alarmManager = (AlarmManager)GetSystemService(AlarmService);
                if (alarmManager != null)
                {
                    var intent = new Intent(this, typeof(AndroidBackgroundService));
                    intent.SetAction(ActionPulse);

                    var flags = Build.VERSION.SdkInt >= BuildVersionCodes.M
                        ? PendingIntentFlags.UpdateCurrent | PendingIntentFlags.Immutable
                        : PendingIntentFlags.UpdateCurrent;

                    var pendingIntent = PendingIntent.GetService(this, 1002, intent, flags);

                    long triggerAtMillis = SystemClock.ElapsedRealtime() + 60000; // Next check in 60s
                    if (Build.VERSION.SdkInt >= BuildVersionCodes.M)
                    {
                        alarmManager.SetExactAndAllowWhileIdle(AlarmType.ElapsedRealtimeWakeup, triggerAtMillis, pendingIntent);
                    }
                    else
                    {
                        alarmManager.SetExact(AlarmType.ElapsedRealtimeWakeup, triggerAtMillis, pendingIntent);
                    }
                }
            }
            catch (Exception ex)
            {
                GpsDiagnostics.Log($"ScheduleNextAlarmWatchdog failed: {ex.Message}");
            }
        }

        // ILocationListener callback invoked directly by Android OS
        public void OnLocationChanged(global::Android.Locations.Location location)
        {
            if (location == null) return;
            GpsDiagnostics.Log($"OnLocationChanged event: Lat={location.Latitude}, Lng={location.Longitude}, Accuracy={location.Accuracy}");
            _ = SendLocationPayloadAsync(location);
        }

        public void OnProviderDisabled(string provider) {}
        public void OnProviderEnabled(string provider) {}
        public void OnStatusChanged(string provider, global::Android.Locations.Availability status, Bundle extras) {}

        private async Task TriggerLocationEvaluationAsync()
        {
            try
            {
                // If a location was sent within the last 45 seconds, skip duplicate
                lock (_sendLock)
                {
                    if ((DateTime.UtcNow - _lastSentTime).TotalSeconds < 45)
                    {
                        return;
                    }
                }

                var context = global::Android.App.Application.Context;
                var location = await GetNativeLocationAsync(context);
                if (location != null)
                {
                    await SendLocationPayloadAsync(location);
                }
                else
                {
                    GpsDiagnostics.Log("TriggerLocationEvaluationAsync: No location resolved.");
                }
            }
            catch (Exception ex)
            {
                GpsDiagnostics.Log($"TriggerLocationEvaluationAsync failed: {ex.Message}");
            }
        }

        private async Task SendLocationPayloadAsync(global::Android.Locations.Location location)
        {
            if (location == null) return;

            lock (_sendLock)
            {
                // Throttling: Ensure at least 45 seconds between submissions
                if ((DateTime.UtcNow - _lastSentTime).TotalSeconds < 45)
                {
                    return;
                }
                _lastSentTime = DateTime.UtcNow;
            }

            PowerManager.WakeLock tickWl = null;
            try
            {
                var powerManager = (PowerManager)GetSystemService(PowerService);
                if (powerManager != null)
                {
                    tickWl = powerManager.NewWakeLock(WakeLockFlags.Partial, "LocationTracker::TickWakeLock");
                    tickWl.Acquire(30000); // 30-second safe timeout
                }

                var context = global::Android.App.Application.Context;
                var clientId = Microsoft.Maui.Storage.Preferences.Default.Get("client_id", "");
                if (string.IsNullOrEmpty(clientId)) return;

                var deviceId = global::Android.Provider.Settings.Secure.GetString(context.ContentResolver, global::Android.Provider.Settings.Secure.AndroidId) ?? "Unknown";
                int.TryParse(clientId, out int numericUserId);
                var timestampStr = DateTime.Now.ToString("yyyy-MM-dd HH:mm");

                LastLatitude = location.Latitude;
                LastLongitude = location.Longitude;

                var payloadObj = new
                {
                    useruniqeid = numericUserId > 0 ? (object)numericUserId : clientId,
                    imeino = deviceId,
                    deviceid = "GPS FIX",
                    gpsLatitude = location.Latitude.ToString(System.Globalization.CultureInfo.InvariantCulture),
                    gpsLongitude = location.Longitude.ToString(System.Globalization.CultureInfo.InvariantCulture),
                    gpsAccuracy = location.Accuracy.ToString(System.Globalization.CultureInfo.InvariantCulture),
                    gpsSpeed = location.Speed.ToString(System.Globalization.CultureInfo.InvariantCulture),
                    gpsTimestamp = timestampStr,
                    calbaering = Math.Round(location.Bearing)
                };
                string payloadJson = System.Text.Json.JsonSerializer.Serialize(payloadObj);

                bool sentSuccessfully = false;
                using (var client = new HttpClient { Timeout = TimeSpan.FromSeconds(15) })
                {
                    client.DefaultRequestHeaders.Add("Bypass-Tunnel-Reminder", "true");
                    try
                    {
                        var content = new StringContent(payloadJson, System.Text.Encoding.UTF8, "application/json");
                        var response = await client.PostAsync("https://fleettrackon.co.in/pcsdia/receiveddata", content);
                        if (response.IsSuccessStatusCode)
                        {
                            sentSuccessfully = true;
                            _locationsSentCount++;
                            LocationsSentCount = _locationsSentCount;
                            var localTime = DateTime.Now.ToString("h:mm:ss tt");
                            LastSyncTime = localTime;
                            GpsDiagnostics.Log($"[Background Service] Sent coordinates natively: Lat={location.Latitude}, Lng={location.Longitude}");

                            await FlushPendingLocationsAsync(client);

                            int pendingNow = PendingLocationsCount;
                            if (pendingNow > 0)
                            {
                                UpdateNotification($"Location sent • {pendingNow} pending • Total sent: {LocationsSentCount}");
                            }
                            else
                            {
                                UpdateNotification($"Location sent to admin • Total: {LocationsSentCount} sent • Last: {localTime}");
                            }
                        }
                        else
                        {
                            GpsDiagnostics.Log($"[Background Service] Failed to send natively: {response.StatusCode} {response.ReasonPhrase}");
                        }
                    }
                    catch (Exception netEx)
                    {
                        GpsDiagnostics.Log($"[Background Service] Network error sending location: {netEx.Message}");
                    }
                }

                if (!sentSuccessfully)
                {
                    SavePendingLocation(payloadJson);
                    int pending = PendingLocationsCount;
                    GpsDiagnostics.Log($"[Background Service] Saved location offline. Pending count: {pending}");
                    UpdateNotification($"Offline Mode • {pending} locations pending • Total sent: {LocationsSentCount}");
                }
            }
            catch (Exception ex)
            {
                GpsDiagnostics.Log($"SendLocationPayloadAsync error: {ex.Message}");
            }
            finally
            {
                if (tickWl != null && tickWl.IsHeld)
                {
                    tickWl.Release();
                }
            }
        }

        private async Task<global::Android.Locations.Location> GetNativeLocationAsync(Context context)
        {
            try
            {
                if (_locationManager == null)
                {
                    _locationManager = (global::Android.Locations.LocationManager)context.GetSystemService(Context.LocationService);
                }
                if (_locationManager == null) return null;

                var isGpsEnabled = _locationManager.IsProviderEnabled(global::Android.Locations.LocationManager.GpsProvider);
                var isNetworkEnabled = _locationManager.IsProviderEnabled(global::Android.Locations.LocationManager.NetworkProvider);

                if (!isGpsEnabled && !isNetworkEnabled) return null;

                global::Android.Locations.Location lastKnownGps = isGpsEnabled ? _locationManager.GetLastKnownLocation(global::Android.Locations.LocationManager.GpsProvider) : null;
                global::Android.Locations.Location lastKnownNetwork = isNetworkEnabled ? _locationManager.GetLastKnownLocation(global::Android.Locations.LocationManager.NetworkProvider) : null;
                global::Android.Locations.Location bestLastKnown = null;

                if (lastKnownGps != null && lastKnownNetwork != null)
                {
                    bestLastKnown = lastKnownGps.Time > lastKnownNetwork.Time ? lastKnownGps : lastKnownNetwork;
                }
                else
                {
                    bestLastKnown = lastKnownGps ?? lastKnownNetwork;
                }

                // If last known location is fresh (< 2 minutes old), return it immediately
                if (bestLastKnown != null)
                {
                    long ageMillis = SystemClock.ElapsedRealtime() - (bestLastKnown.ElapsedRealtimeNanos / 1000000L);
                    if (ageMillis < 120000)
                    {
                        return bestLastKnown;
                    }
                }

                var tcs = new TaskCompletionSource<global::Android.Locations.Location>();
                var singleListener = new SingleLocationListener(tcs);

                if (isGpsEnabled)
                {
                    _locationManager.RequestLocationUpdates(global::Android.Locations.LocationManager.GpsProvider, 0, 0, singleListener, context.MainLooper);
                }
                if (isNetworkEnabled)
                {
                    _locationManager.RequestLocationUpdates(global::Android.Locations.LocationManager.NetworkProvider, 0, 0, singleListener, context.MainLooper);
                }

                var delayTask = Task.Delay(10000);
                var completedTask = await Task.WhenAny(tcs.Task, delayTask);

                _locationManager.RemoveUpdates(singleListener);

                if (completedTask == tcs.Task)
                {
                    return await tcs.Task;
                }

                return bestLastKnown;
            }
            catch (Exception ex)
            {
                GpsDiagnostics.Log($"GetNativeLocationAsync failed: {ex.Message}");
                return null;
            }
        }

        private class SingleLocationListener : Java.Lang.Object, global::Android.Locations.ILocationListener
        {
            private readonly TaskCompletionSource<global::Android.Locations.Location> _tcs;

            public SingleLocationListener(TaskCompletionSource<global::Android.Locations.Location> tcs)
            {
                _tcs = tcs;
            }

            public void OnLocationChanged(global::Android.Locations.Location location)
            {
                _tcs.TrySetResult(location);
            }

            public void OnProviderDisabled(string provider) {}
            public void OnProviderEnabled(string provider) {}
            public void OnStatusChanged(string provider, global::Android.Locations.Availability status, Bundle extras) {}
        }

        private void CreateNotificationChannel()
        {
            if (Build.VERSION.SdkInt >= BuildVersionCodes.O)
            {
                var channel = new NotificationChannel(ChannelId, "Location Services", NotificationImportance.High)
                {
                    Description = "Background location tracking foreground service updates"
                };
                var manager = GetSystemService(NotificationService) as NotificationManager;
                manager?.CreateNotificationChannel(channel);
            }
        }

        public override void OnTaskRemoved(Intent rootIntent)
        {
            base.OnTaskRemoved(rootIntent);
            GpsDiagnostics.Log("[Background Service] OnTaskRemoved invoked. Rescheduling foreground service restart...");
            try
            {
                var restartIntent = new Intent(this, typeof(AndroidBackgroundService));
                var flags = Build.VERSION.SdkInt >= BuildVersionCodes.M
                    ? PendingIntentFlags.UpdateCurrent | PendingIntentFlags.Immutable
                    : PendingIntentFlags.UpdateCurrent;

                var pendingIntent = PendingIntent.GetService(this, 1003, restartIntent, flags);
                var alarmManager = (AlarmManager)GetSystemService(AlarmService);
                alarmManager?.Set(AlarmType.ElapsedRealtimeWakeup, SystemClock.ElapsedRealtime() + 1000, pendingIntent);
            }
            catch (Exception ex)
            {
                GpsDiagnostics.Log($"OnTaskRemoved restart failed: {ex.Message}");
            }
        }

        public override void OnDestroy()
        {
            _timer?.Dispose();
            if (_locationManager != null)
            {
                try { _locationManager.RemoveUpdates(this); } catch {}
            }
            if (_wakeLock != null && _wakeLock.IsHeld)
            {
                _wakeLock.Release();
            }
            base.OnDestroy();
        }
    }
}
#endif
