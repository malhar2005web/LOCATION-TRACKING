using Android.App;
using Android.Content;
using Android.Content.PM;
using Android.Net;
using Android.OS;
using Android.Provider;

namespace LOCATION_TRACKING
{
    [Activity(Theme = "@style/Maui.SplashTheme", MainLauncher = true, ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation | ConfigChanges.UiMode | ConfigChanges.ScreenLayout | ConfigChanges.SmallestScreenSize | ConfigChanges.Density)]
    public class MainActivity : MauiAppCompatActivity
    {
        protected override void OnCreate(Bundle? savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            // 1. Natively request notification permission on startup for Android 13+ (API 33+)
            if (Build.VERSION.SdkInt >= BuildVersionCodes.Tiramisu)
            {
                if (CheckSelfPermission(global::Android.Manifest.Permission.PostNotifications) != global::Android.Content.PM.Permission.Granted)
                {
                    RequestPermissions(new string[] { global::Android.Manifest.Permission.PostNotifications }, 0);
                }
            }

            // 2. Request Battery Optimization Exemption so Android Doze Mode never kills background tracking past 1 hour
            try
            {
                if (Build.VERSION.SdkInt >= BuildVersionCodes.M)
                {
                    var powerManager = (PowerManager?)GetSystemService(PowerService);
                    if (powerManager != null && !powerManager.IsIgnoringBatteryOptimizations(PackageName))
                    {
                        var intent = new Intent(Settings.ActionRequestIgnoreBatteryOptimizations);
                        intent.SetData(Android.Net.Uri.Parse($"package:{PackageName}"));
                        intent.AddFlags(ActivityFlags.NewTask);
                        StartActivity(intent);
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[BatteryOptimization] Request failed: {ex.Message}");
            }
        }
    }
}
