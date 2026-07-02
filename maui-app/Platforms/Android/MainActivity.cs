using Android.App;
using Android.Content.PM;
using Android.OS;

namespace LOCATION_TRACKING
{
    [Activity(Theme = "@style/Maui.SplashTheme", MainLauncher = true, ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation | ConfigChanges.UiMode | ConfigChanges.ScreenLayout | ConfigChanges.SmallestScreenSize | ConfigChanges.Density)]
    public class MainActivity : MauiAppCompatActivity
    {
        protected override void OnCreate(Bundle? savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            // Natively request notification permission on startup for Android 13+ (API 33+)
            if (Build.VERSION.SdkInt >= BuildVersionCodes.Tiramisu)
            {
                if (CheckSelfPermission(global::Android.Manifest.Permission.PostNotifications) != global::Android.Content.PM.Permission.Granted)
                {
                    RequestPermissions(new string[] { global::Android.Manifest.Permission.PostNotifications }, 0);
                }
            }
        }
    }
}
