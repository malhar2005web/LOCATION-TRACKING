using LocationTracker.Models;

namespace LocationTracker.Services.Storage
{
    public interface IStorageService
    {
        Task InitAsync();
        
        // DSR Records storage
        Task SaveDsrAsync(DsrRecord dsr);
        Task<List<DsrRecord>> GetPendingDsrsAsync();
        Task DeleteDsrAsync(int localId);
        Task MarkDsrAsSyncedAsync(int localId);
        
        // Reminder Records storage
        Task SaveReminderAsync(ReminderRecord reminder);
        Task<List<ReminderRecord>> GetRemindersAsync();
        Task UpdateReminderStatusAsync(string reminderId, string status);
        
        // Key-Value preferences helper (replacement for localStorage)
        Task SetPreferenceAsync<T>(string key, T value);
        Task<T> GetPreferenceAsync<T>(string key, T defaultValue = default);
    }
}
