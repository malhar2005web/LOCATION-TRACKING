using Microsoft.JSInterop;
using LocationTracker.Services.Storage;

namespace LOCATION_TRACKING
{
    public partial class MainPage : ContentPage
    {
        public MainPage()
        {
            InitializeComponent();
        }

        protected override async void OnAppearing()
        {
            base.OnAppearing();
            await RequestStartupPermissionsAsync();

            try
            {
                var storage = Microsoft.Maui.IPlatformApplication.Current?.Services.GetService<IStorageService>();
                if (storage != null)
                {
                    var clientId = await storage.GetPreferenceAsync<string>("client_id", "");
                    if (!string.IsNullOrEmpty(clientId))
                    {
#if ANDROID
                        var context = Android.App.Application.Context;
                        var intent = new Android.Content.Intent(context, typeof(LocationTracker.Platforms.Android.AndroidBackgroundService));
                        if (Android.OS.Build.VERSION.SdkInt >= Android.OS.BuildVersionCodes.O)
                            context.StartForegroundService(intent);
                        else
                            context.StartService(intent);
#endif
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[Startup] Failed to check client_id on app start: {ex.Message}");
            }
        }

        private async Task RequestStartupPermissionsAsync()
        {
            try
            {
                // 1. Request location permissions
                var locStatus = await Permissions.RequestAsync<Permissions.LocationWhenInUse>();
                if (locStatus == PermissionStatus.Granted)
                {
                    // Request background location
                    await Permissions.RequestAsync<Permissions.LocationAlways>();
                }

                // 2. Request notifications permission
                await Permissions.RequestAsync<Permissions.PostNotifications>();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[Permissions] Startup check failed: {ex.Message}");
            }
        }

        [JSInvokable]
        public static async Task OnLocalStorageChanged(string key, string? value)
        {
            try
            {
                var storage = Microsoft.Maui.IPlatformApplication.Current?.Services.GetService<IStorageService>();
                if (storage != null)
                {
                    if (value == null)
                    {
                        await storage.SetPreferenceAsync<string?>(key, null);
                    }
                    else
                    {
                        await storage.SetPreferenceAsync<string>(key, value);
                    }

                    // Launch background tracking foreground service as soon as client_id is set (user logs in)
                    if (key == "client_id" && !string.IsNullOrEmpty(value))
                    {
#if ANDROID
                        var context = Android.App.Application.Context;
                        var intent = new Android.Content.Intent(context, typeof(LocationTracker.Platforms.Android.AndroidBackgroundService));
                        if (Android.OS.Build.VERSION.SdkInt >= Android.OS.BuildVersionCodes.O)
                            context.StartForegroundService(intent);
                        else
                            context.StartService(intent);
#endif
                    }
                    else if (key == "client_id" && string.IsNullOrEmpty(value))
                    {
#if ANDROID
                        var context = Android.App.Application.Context;
                        var intent = new Android.Content.Intent(context, typeof(LocationTracker.Platforms.Android.AndroidBackgroundService));
                        context.StopService(intent);
#endif
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[Bridge] localStorage sync failed: {ex.Message}");
            }
        }

        [JSInvokable]
        public static async Task StartBackgroundService()
        {
            try
            {
                var storage = Microsoft.Maui.IPlatformApplication.Current?.Services.GetService<IStorageService>();
                if (storage != null)
                {
                    var clientId = await storage.GetPreferenceAsync<string>("client_id", "");
                    if (!string.IsNullOrEmpty(clientId))
                    {
#if ANDROID
                        var context = Android.App.Application.Context;
                        var intent = new Android.Content.Intent(context, typeof(LocationTracker.Platforms.Android.AndroidBackgroundService));
                        if (Android.OS.Build.VERSION.SdkInt >= Android.OS.BuildVersionCodes.O)
                            context.StartForegroundService(intent);
                        else
                            context.StartService(intent);
#endif
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[Bridge] StartBackgroundService failed: {ex.Message}");
            }
        }

        [JSInvokable]
        public static Task<string> GetLastException()
        {
            try
            {
                var path = Path.Combine(FileSystem.AppDataDirectory, "unhandled_errors.txt");
                if (File.Exists(path))
                {
                    var content = File.ReadAllText(path);
                    File.Delete(path); // Clear it after reading
                    return Task.FromResult(content);
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[Bridge] Failed to read last exception: {ex.Message}");
            }
            return Task.FromResult(string.Empty);
        }

        [JSInvokable]
        public static Task<string> GetDeviceId()
        {
#if ANDROID
            try
            {
                var context = Android.App.Application.Context;
                string id = Android.Provider.Settings.Secure.GetString(context.ContentResolver, Android.Provider.Settings.Secure.AndroidId);
                if (!string.IsNullOrEmpty(id))
                {
                    return Task.FromResult(id);
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[Bridge] Failed to get Android ID: {ex.Message}");
            }
#endif
            // Fallback to a persistent Guid stored in preferences
            string key = "device_guid_fallback";
            string savedGuid = Microsoft.Maui.Storage.Preferences.Default.Get(key, string.Empty);
            if (string.IsNullOrEmpty(savedGuid))
            {
                savedGuid = Guid.NewGuid().ToString();
                Microsoft.Maui.Storage.Preferences.Default.Set(key, savedGuid);
            }
            return Task.FromResult(savedGuid);
        }

        [JSInvokable]
        public static async Task<string?> GetCurrentLocation()
        {
            try
            {
                var gps = Microsoft.Maui.IPlatformApplication.Current?.Services.GetService<LocationTracker.Services.Gps.IGpsService>();
                if (gps != null)
                {
                    var location = await gps.GetCurrentLocationAsync();
                    if (location != null)
                    {
                        return System.Text.Json.JsonSerializer.Serialize(new
                        {
                            latitude = location.Latitude,
                            longitude = location.Longitude,
                            accuracy = location.Accuracy ?? 0.0,
                            speed = location.Speed ?? 0.0,
                            bearing = location.Course ?? 0.0,
                            altitude = location.Altitude ?? 0.0
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[Bridge] GetCurrentLocation failed: {ex.Message}");
            }
            return null;
        }

        [JSInvokable]
        public static async Task RequestLocationPermission()
        {
            await Microsoft.Maui.ApplicationModel.MainThread.InvokeOnMainThreadAsync(async () =>
            {
                try
                {
                    var locStatus = await Permissions.RequestAsync<Permissions.LocationWhenInUse>();
                    if (locStatus == PermissionStatus.Granted)
                    {
                        await Permissions.RequestAsync<Permissions.LocationAlways>();
                    }
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine($"[Bridge] RequestLocationPermission failed: {ex.Message}");
                }
            });
        }

        [JSInvokable]
        public static async Task RequestNotificationPermission()
        {
            await Microsoft.Maui.ApplicationModel.MainThread.InvokeOnMainThreadAsync(async () =>
            {
                try
                {
                    await Permissions.RequestAsync<Permissions.PostNotifications>();
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine($"[Bridge] RequestNotificationPermission failed: {ex.Message}");
                }
            });
        }

        [JSInvokable]
        public static async Task RequestFullScreenIntentPermission()
        {
            await Microsoft.Maui.ApplicationModel.MainThread.InvokeOnMainThreadAsync(() =>
            {
                OpenAppSettings();
            });
        }

        [JSInvokable]
        public static async Task RequestOverlayPermission()
        {
            await Microsoft.Maui.ApplicationModel.MainThread.InvokeOnMainThreadAsync(() =>
            {
#if ANDROID
                var context = Android.App.Application.Context;
                if (!global::Android.Provider.Settings.CanDrawOverlays(context))
                {
                    var intent = new Android.Content.Intent(
                        global::Android.Provider.Settings.ActionManageOverlayPermission,
                        Android.Net.Uri.Parse($"package:{context.PackageName}")
                    );
                    intent.AddFlags(Android.Content.ActivityFlags.NewTask);
                    context.StartActivity(intent);
                }
#endif
            });
        }

        [JSInvokable]
        public static async Task RequestBatteryOptimizationExemption()
        {
            await Microsoft.Maui.ApplicationModel.MainThread.InvokeOnMainThreadAsync(() =>
            {
#if ANDROID
                var context = Android.App.Application.Context;
                var powerManager = (Android.OS.PowerManager)context.GetSystemService(Android.Content.Context.PowerService)!;
                if (!powerManager.IsIgnoringBatteryOptimizations(context.PackageName))
                {
                    var intent = new Android.Content.Intent(
                        global::Android.Provider.Settings.ActionRequestIgnoreBatteryOptimizations,
                        Android.Net.Uri.Parse($"package:{context.PackageName}")
                    );
                    intent.AddFlags(Android.Content.ActivityFlags.NewTask);
                    context.StartActivity(intent);
                }
#endif
            });
        }

        private static void OpenAppSettings()
        {
#if ANDROID
            var context = Android.App.Application.Context;
            var intent = new Android.Content.Intent(
                global::Android.Provider.Settings.ActionApplicationDetailsSettings,
                Android.Net.Uri.Parse($"package:{context.PackageName}")
            );
            intent.AddFlags(Android.Content.ActivityFlags.NewTask);
            context.StartActivity(intent);
#endif
        }
    }
}
