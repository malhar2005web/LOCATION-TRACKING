#if ANDROID
using Android.App;
using Android.Content;
using Android.OS;
using LocationTracker.Services.Storage;

namespace LocationTracker.Platforms.Android
{
    [BroadcastReceiver(Name = "com.locationtracker.app.BootReceiver", Enabled = true, Exported = true)]
    [IntentFilter(new[] { Intent.ActionBootCompleted, "android.intent.action.QUICKBOOT_POWERON" })]
    public class BootReceiver : BroadcastReceiver
    {
        public override async void OnReceive(Context context, Intent intent)
        {
            if (intent.Action == Intent.ActionBootCompleted || intent.Action == "android.intent.action.QUICKBOOT_POWERON")
            {
                var sharedPref = context.GetSharedPreferences("com.locationtracker.app.microsoft.maui.essentials.preferences", FileCreationMode.Private);
                var clientId = sharedPref.GetString("client_id", "");

                // Re-start tracking service on reboot if user is logged in
                if (!string.IsNullOrEmpty(clientId))
                {
                    var serviceIntent = new Intent(context, typeof(AndroidBackgroundService));
                    if (Build.VERSION.SdkInt >= BuildVersionCodes.O)
                    {
                        context.StartForegroundService(serviceIntent);
                    }
                    else
                    {
                        context.StartService(serviceIntent);
                    }
                }
            }
        }
    }
}
#endif
