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
    public class AndroidBackgroundService : Service
    {
        private const int ServiceNotificationId = 1001;
        private const string ChannelId = "LocationTrackingChannel";
        private System.Threading.Timer _timer;
        private PowerManager.WakeLock _wakeLock;

        public override IBinder OnBind(Intent intent) => null;

        public override StartCommandResult OnStartCommand(Intent intent, StartCommandFlags flags, int startId)
        {
            GpsDiagnostics.Log("OnStartCommand invoked.");
            try
            {
                CreateNotificationChannel();
                var notification = new NotificationCompat.Builder(this, ChannelId)
                    .SetContentTitle("Location Tracking Active")
                    .SetContentText("your location is being tracked/sent to admin")
                    .SetSmallIcon(global::Android.Resource.Drawable.IcMenuMyLocation) // Maps to system monochrome location icon
                    .SetOngoing(true)
                    .SetCategory(NotificationCompat.CategoryService)
                    .SetPriority(NotificationCompat.PriorityHigh) // Elevated priority so it remains visible and alerts the user
                    .Build();

                GpsDiagnostics.Log("Notification object built. Acquiring wake lock...");

                // Acquire CPU wake lock to ensure background execution continues during sleep
                var powerManager = (PowerManager)GetSystemService(PowerService);
                _wakeLock = powerManager.NewWakeLock(WakeLockFlags.Partial, "LocationTracker::BackgroundWakeLock");
                _wakeLock.Acquire();

                GpsDiagnostics.Log("Wake lock acquired. Calling StartForeground...");

                if (Build.VERSION.SdkInt >= BuildVersionCodes.Q)
                {
                    StartForeground(ServiceNotificationId, notification, global::Android.Content.PM.ForegroundService.TypeLocation);
                }
                else
                {
                    StartForeground(ServiceNotificationId, notification);
                }

                GpsDiagnostics.Log("StartForeground call completed successfully.");
            }
            catch (Exception ex)
            {
                GpsDiagnostics.Log($"Failed to initialize foreground service properties: {ex.Message}\n{ex.StackTrace}");
            }

            // Fetch and report GPS location coordinates every 1 minute
            _timer = new System.Threading.Timer(async _ =>
            {
                try
                {
                    GpsDiagnostics.Log("Timer tick triggered.");
                    var context = global::Android.App.Application.Context;
                    var sharedPref = context.GetSharedPreferences("com.locationtracker.app.microsoft.maui.essentials.preferences", global::Android.Content.FileCreationMode.Private);
                    var clientId = sharedPref.GetString("client_id", "");

                    GpsDiagnostics.Log($"Timer tick: Client ID read from shared preference = '{clientId}'");

                    // Track location continuously if user is logged in
                    if (!string.IsNullOrEmpty(clientId))
                    {
                        GpsDiagnostics.Log("Fetching native location...");
                        var location = await GetNativeLocationAsync(context);

                        if (location != null)
                        {
                            GpsDiagnostics.Log($"Native location resolved: Lat={location.Latitude}, Lng={location.Longitude}, Accuracy={location.Accuracy}");
                            var deviceId = global::Android.Provider.Settings.Secure.GetString(context.ContentResolver, global::Android.Provider.Settings.Secure.AndroidId) ?? "Unknown";

                            int.TryParse(clientId, out int numericUserId);
                            var timestampStr = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm");

                            using (var client = new HttpClient())
                            {
                                client.DefaultRequestHeaders.Add("Bypass-Tunnel-Reminder", "true");

                                var payload = new
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

                                GpsDiagnostics.Log("Posting native coordinates payload to Skyway...");
                                var response = await client.PostAsJsonAsync("https://fleettrackon.co.in/skywaydia/receiveddata", payload);
                                if (response.IsSuccessStatusCode)
                                {
                                    GpsDiagnostics.Log($"[Background Service] Sent coordinates natively: Lat={location.Latitude}, Lng={location.Longitude}");
                                }
                                else
                                {
                                    GpsDiagnostics.Log($"[Background Service] Failed to send natively: {response.StatusCode} {response.ReasonPhrase}");
                                }
                            }
                        }
                        else
                        {
                            GpsDiagnostics.Log("Native location resolved to null.");
                        }
                    }
                }
                catch (Exception ex)
                {
                    GpsDiagnostics.Log($"Native tracking timer execution failed: {ex.Message}\n{ex.StackTrace}");
                }
            }, null, TimeSpan.Zero, TimeSpan.FromMinutes(1));

            return StartCommandResult.Sticky;
        }

        private async Task<global::Android.Locations.Location> GetNativeLocationAsync(Context context)
        {
            try
            {
                var locationManager = (global::Android.Locations.LocationManager)context.GetSystemService(Context.LocationService);
                if (locationManager == null)
                {
                    GpsDiagnostics.Log("LocationManager is null.");
                    return null;
                }

                var isGpsEnabled = locationManager.IsProviderEnabled(global::Android.Locations.LocationManager.GpsProvider);
                var isNetworkEnabled = locationManager.IsProviderEnabled(global::Android.Locations.LocationManager.NetworkProvider);

                GpsDiagnostics.Log($"Provider status: GPS={isGpsEnabled}, Network={isNetworkEnabled}");

                if (!isGpsEnabled && !isNetworkEnabled)
                {
                    GpsDiagnostics.Log("Both GPS and Network location providers are disabled on device settings!");
                    return null;
                }

                var provider = isGpsEnabled ? global::Android.Locations.LocationManager.GpsProvider : global::Android.Locations.LocationManager.NetworkProvider;
                var lastKnown = locationManager.GetLastKnownLocation(provider);
                GpsDiagnostics.Log($"Last known location read from '{provider}': " + (lastKnown != null ? $"Lat={lastKnown.Latitude}, Lng={lastKnown.Longitude}" : "null"));

                var tcs = new TaskCompletionSource<global::Android.Locations.Location>();
                var listener = new ActiveLocationListener(tcs);

                GpsDiagnostics.Log($"Requesting single location update from provider '{provider}'...");
                locationManager.RequestLocationUpdates(provider, 0, 0, listener, context.MainLooper);

                var delayTask = Task.Delay(10000); // 10 seconds timeout
                var completedTask = await Task.WhenAny(tcs.Task, delayTask);

                locationManager.RemoveUpdates(listener);

                if (completedTask == tcs.Task)
                {
                    var freshLocation = await tcs.Task;
                    GpsDiagnostics.Log("Successfully obtained fresh native coordinates.");
                    return freshLocation;
                }
                else
                {
                    GpsDiagnostics.Log("Fresh location update request timed out (10s limit exceeded). Falling back to last known location.");
                    return lastKnown;
                }
            }
            catch (Exception ex)
            {
                GpsDiagnostics.Log($"GetNativeLocationAsync failed: {ex.Message}\n{ex.StackTrace}");
                return null;
            }
        }

        private class ActiveLocationListener : Java.Lang.Object, global::Android.Locations.ILocationListener
        {
            private readonly TaskCompletionSource<global::Android.Locations.Location> _tcs;

            public ActiveLocationListener(TaskCompletionSource<global::Android.Locations.Location> tcs)
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

        public override void OnDestroy()
        {
            _timer?.Dispose();
            if (_wakeLock != null && _wakeLock.IsHeld)
            {
                _wakeLock.Release();
            }
            base.OnDestroy();
        }
    }
}
#endif
