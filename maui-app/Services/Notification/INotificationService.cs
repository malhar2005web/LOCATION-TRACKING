namespace LocationTracker.Services.Notification
{
    public interface INotificationService
    {
        void SendLocalNotification(string title, string body, int id = 100);
        Task RequestNotificationPermissionAsync();
    }
}
