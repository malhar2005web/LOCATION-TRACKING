using Microsoft.Extensions.Logging;
#if ANDROID
using Plugin.LocalNotification;
#endif

namespace LOCATION_TRACKING
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
#if ANDROID
                .UseLocalNotification()
#endif
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                });

            builder.Services.AddMauiBlazorWebView();

            builder.Services.AddSingleton<LocationTracker.Services.Storage.IStorageService, LocationTracker.Services.Storage.SqliteStorageService>();
            builder.Services.AddSingleton<LocationTracker.Services.Api.IApiService, LocationTracker.Services.Api.ApiService>();
            builder.Services.AddSingleton<LocationTracker.Services.Gps.IGpsService, LocationTracker.Services.Gps.GpsService>();
            builder.Services.AddSingleton<LocationTracker.Services.Notification.INotificationService, LocationTracker.Services.Notification.NotificationService>();

#if DEBUG
    		builder.Services.AddBlazorWebViewDeveloperTools();
    		builder.Logging.AddDebug();
#endif

#if ANDROID
            Microsoft.AspNetCore.Components.WebView.Maui.BlazorWebViewHandler.BlazorWebViewMapper.AppendToMapping("MyBlazorWebViewCustomization", (handler, view) =>
            {
                handler.PlatformView.Settings.JavaScriptEnabled = true;
                handler.PlatformView.Settings.SetGeolocationEnabled(true);
                handler.PlatformView.Settings.MixedContentMode = global::Android.Webkit.MixedContentHandling.AlwaysAllow;

            });
#endif

            return builder.Build();
        }
    }

#if ANDROID
    public class MyWebChromeClient : global::Android.Webkit.WebChromeClient
    {
        public override void OnGeolocationPermissionsShowPrompt(string? origin, global::Android.Webkit.GeolocationPermissions.ICallback? callback)
        {
            callback?.Invoke(origin, true, false);
        }
    }
#endif
}
