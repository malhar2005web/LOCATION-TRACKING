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
    [Service(ForegroundServiceType = global::Android.Content.PM.ForegroundService.TypeLocation)]
    public class AndroidBackgroundService : Service
    {
        private const int ServiceNotificationId = 1001;
        private const string ChannelId = "LocationTrackingChannel";
        private System.Threading.Timer _timer;
        private PowerManager.WakeLock _wakeLock;

        public override IBinder OnBind(Intent intent) => null;

        public override StartCommandResult OnStartCommand(Intent intent, StartCommandFlags flags, int startId)
        {
            CreateNotificationChannel();
            var notification = new NotificationCompat.Builder(this, ChannelId)
                .SetContentTitle("Location Tracking Active")
                .SetContentText("your location is being tracked/sent to admin")
                .SetSmallIcon(global::LOCATION_TRACKING.Resource.Mipmap.appicon) // Maps to app logo
                .SetOngoing(true)
                .SetCategory(NotificationCompat.CategoryService)
                .SetPriority(NotificationCompat.PriorityHigh) // Elevated priority so it remains visible and alerts the user
                .Build();

            // Acquire CPU wake lock to ensure background execution continues during sleep
            var powerManager = (PowerManager)GetSystemService(PowerService);
            _wakeLock = powerManager.NewWakeLock(WakeLockFlags.Partial, "LocationTracker::BackgroundWakeLock");
            _wakeLock.Acquire();

            StartForeground(ServiceNotificationId, notification);

            // Fetch and report GPS location coordinates every 1 minute
            _timer = new System.Threading.Timer(async _ =>
            {
                try
                {
                    var context = global::Android.App.Application.Context;
                    var sharedPref = context.GetSharedPreferences("com.locationtracker.app.microsoft.maui.essentials.preferences", global::Android.Content.FileCreationMode.Private);
                    var clientId = sharedPref.GetString("client_id", "");

                    // Track location continuously if user is logged in
                    if (!string.IsNullOrEmpty(clientId))
                    {
                        var request = new GeolocationRequest(GeolocationAccuracy.High, TimeSpan.FromSeconds(10));
                        var location = await Geolocation.Default.GetLocationAsync(request);

                        if (location != null)
                        {
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
                                    gpsAccuracy = (location.Accuracy ?? 0).ToString(System.Globalization.CultureInfo.InvariantCulture),
                                    gpsSpeed = (location.Speed ?? 0).ToString(System.Globalization.CultureInfo.InvariantCulture),
                                    gpsTimestamp = timestampStr,
                                    calbaering = Math.Round(location.Course ?? 0)
                                };

                                var response = await client.PostAsJsonAsync("https://fleettrackon.co.in/skywaydia/receiveddata", payload);
                                if (response.IsSuccessStatusCode)
                                {
                                    System.Diagnostics.Debug.WriteLine($"[Background Service] Sent coordinates natively to Skyway: Lat={location.Latitude}, Lng={location.Longitude}");
                                }
                                else
                                {
                                    System.Diagnostics.Debug.WriteLine($"[Background Service] Failed to send natively: {response.StatusCode}");
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine($"[Background Service] Native tracking timer execution failed: {ex.Message}");
                }
            }, null, TimeSpan.Zero, TimeSpan.FromMinutes(1));

            return StartCommandResult.Sticky;
        }

        private void CreateNotificationChannel()
        {
            if (Build.VERSION.SdkInt >= BuildVersionCodes.O)
            {
                var channel = new NotificationChannel(ChannelId, "Location Services", NotificationImportance.Low)
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
