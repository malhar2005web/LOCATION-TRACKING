#if ANDROID
using Android.App;
using Android.Content;
using Android.OS;
using AndroidX.Core.App;
using LocationTracker.Services.Gps;
using LocationTracker.Services.Api;
using LocationTracker.Services.Storage;

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
                .SetContentTitle("Location Monitoring Active")
                .SetContentText("Your location is being updated in the background.")
                .SetSmallIcon(global::LOCATION_TRACKING.Resource.Mipmap.appicon)
                .SetOngoing(true)
                .SetCategory(NotificationCompat.CategoryService)
                .SetPriority(NotificationCompat.PriorityLow)
                .Build();

            var powerManager = (PowerManager)GetSystemService(PowerService);
            _wakeLock = powerManager.NewWakeLock(WakeLockFlags.Partial, "LocationTracker::BackgroundWakeLock");
            _wakeLock.Acquire();

            StartForeground(ServiceNotificationId, notification);

            _timer = new System.Threading.Timer(async _ =>
            {
                var storage = Microsoft.Maui.IPlatformApplication.Current!.Services.GetService<IStorageService>()!;
                var isDayStarted = await storage.GetPreferenceAsync<bool>("isDayStarted", false);
                var isCheckedIn = await storage.GetPreferenceAsync<bool>("isCheckedIn", false);

                if (isDayStarted || isCheckedIn)
                {
                    var gps = Microsoft.Maui.IPlatformApplication.Current!.Services.GetService<IGpsService>()!;
                    var api = Microsoft.Maui.IPlatformApplication.Current!.Services.GetService<IApiService>()!;
                    
                    var location = await gps.GetCurrentLocationAsync();
                    if (location != null)
                    {
                        try
                        {
                            var clientId = await storage.GetPreferenceAsync<string>("client_id", "Unknown");
                            var deviceId = global::Android.Provider.Settings.Secure.GetString(global::Android.App.Application.Context.ContentResolver, global::Android.Provider.Settings.Secure.AndroidId) ?? "Unknown";

                            await api.RequestAsync<object>("/api/client/receiveddata", HttpMethod.Post, new
                            {
                                clientId = clientId,
                                deviceId = deviceId,
                                latitude = location.Latitude,
                                longitude = location.Longitude,
                                timestamp = DateTime.UtcNow.ToString("o")
                            });
                            System.Diagnostics.Debug.WriteLine($"[Background Service] Sent coordinates: Lat={location.Latitude}, Lng={location.Longitude}");
                        }
                        catch (Exception ex)
                        {
                            System.Diagnostics.Debug.WriteLine($"[Background Service] Failed to upload location: {ex.Message}");
                        }
                    }
                }
            }, null, TimeSpan.Zero, TimeSpan.FromMinutes(5));

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
