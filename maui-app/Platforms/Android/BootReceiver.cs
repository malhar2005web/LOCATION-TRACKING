#if ANDROID
using Android.App;
using Android.Content;
using Android.OS;
using LocationTracker.Services.Storage;

namespace LocationTracker.Platforms.Android
{
    [BroadcastReceiver(Enabled = true, Exported = true)]
    [IntentFilter(new[] { Intent.ActionBootCompleted, "android.intent.action.QUICKBOOT_POWERON" })]
    public class BootReceiver : BroadcastReceiver
    {
        public override async void OnReceive(Context context, Intent intent)
        {
            if (intent.Action == Intent.ActionBootCompleted || intent.Action == "android.intent.action.QUICKBOOT_POWERON")
            {
                var storage = Microsoft.Maui.IPlatformApplication.Current!.Services.GetService<IStorageService>()!;
                var isDayStarted = await storage.GetPreferenceAsync<bool>("isDayStarted", false);
                var isCheckedIn = await storage.GetPreferenceAsync<bool>("isCheckedIn", false);

                if (isDayStarted || isCheckedIn)
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
