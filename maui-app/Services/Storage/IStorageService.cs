using LocationTracker.Models;

namespace LocationTracker.Services.Storage
{
    public interface IStorageService
    {
        Task InitAsync();

        Task SaveDsrAsync(DsrRecord dsr);
        Task<List<DsrRecord>> GetPendingDsrsAsync();
        Task DeleteDsrAsync(int localId);
        Task MarkDsrAsSyncedAsync(int localId);

        Task SaveReminderAsync(ReminderRecord reminder);
        Task<List<ReminderRecord>> GetRemindersAsync();
        Task UpdateReminderStatusAsync(string reminderId, string status);

        Task SetPreferenceAsync<T>(string key, T value);
        Task<T> GetPreferenceAsync<T>(string key, T defaultValue = default);
    }
}
