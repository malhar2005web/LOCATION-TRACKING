#if ANDROID
using Plugin.LocalNotification;
#endif

namespace LocationTracker.Services.Notification
{
    public class NotificationService : INotificationService
    {
        public async Task RequestNotificationPermissionAsync()
        {
#if ANDROID
            try
            {
                var granted = await LocalNotificationCenter.Current.AreNotificationsEnabled();
                if (!granted)
                {
                    await LocalNotificationCenter.Current.RequestNotificationPermission();
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[Notification] Permission request failed: {ex.Message}");
            }
#else
            await Task.CompletedTask;
#endif
        }

        public void SendLocalNotification(string title, string body, int id = 100)
        {
#if ANDROID
            try
            {
                var notification = new NotificationRequest
                {
                    NotificationId = id,
                    Title = title,
                    Description = body,
                    BadgeNumber = 1,
                    Schedule = { NotifyTime = DateTime.Now.AddSeconds(0.5) } // near-immediate delivery
                };
                LocalNotificationCenter.Current.Show(notification);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[Notification] Push failed: {ex.Message}");
            }
#endif
        }
    }
}
