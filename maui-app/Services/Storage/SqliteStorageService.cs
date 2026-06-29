using SQLite;
using LocationTracker.Models;

namespace LocationTracker.Services.Storage
{
    public class SqliteStorageService : IStorageService
    {
        private SQLiteAsyncConnection _db = default!;
        private readonly string _dbPath = Path.Combine(FileSystem.AppDataDirectory, "dsr_tracker.db3");

        public async Task InitAsync()
        {
            if (_db != null) return;
            
            _db = new SQLiteAsyncConnection(_dbPath);
            await _db.CreateTableAsync<DsrRecord>();
            await _db.CreateTableAsync<ReminderRecord>();
        }

        public async Task SaveDsrAsync(DsrRecord dsr)
        {
            await InitAsync();
            if (dsr.LocalId == 0)
                await _db.InsertAsync(dsr);
            else
                await _db.UpdateAsync(dsr);
        }

        public async Task<List<DsrRecord>> GetPendingDsrsAsync()
        {
            await InitAsync();
            return await _db.Table<DsrRecord>().Where(d => d.IsSynced == false).ToListAsync();
        }

        public async Task DeleteDsrAsync(int localId)
        {
            await InitAsync();
            await _db.DeleteAsync<DsrRecord>(localId);
        }

        public async Task MarkDsrAsSyncedAsync(int localId)
        {
            await InitAsync();
            var record = await _db.Table<DsrRecord>().FirstOrDefaultAsync(d => d.LocalId == localId);
            if (record != null)
            {
                record.IsSynced = true;
                await _db.UpdateAsync(record);
            }
        }

        public async Task SaveReminderAsync(ReminderRecord reminder)
        {
            await InitAsync();
            var existing = await _db.Table<ReminderRecord>().FirstOrDefaultAsync(r => r.Id == reminder.Id);
            if (existing != null)
            {
                reminder.LocalId = existing.LocalId;
                await _db.UpdateAsync(reminder);
            }
            else
            {
                await _db.InsertAsync(reminder);
            }
        }

        public async Task<List<ReminderRecord>> GetRemindersAsync()
        {
            await InitAsync();
            return await _db.Table<ReminderRecord>().ToListAsync();
        }

        public async Task UpdateReminderStatusAsync(string reminderId, string status)
        {
            await InitAsync();
            var existing = await _db.Table<ReminderRecord>().FirstOrDefaultAsync(r => r.Id == reminderId);
            if (existing != null)
            {
                existing.Status = status;
                await _db.UpdateAsync(existing);
            }
        }

        public Task SetPreferenceAsync<T>(string key, T value)
        {
            if (value == null)
            {
                Preferences.Default.Remove(key);
            }
            else
            {
                Preferences.Default.Set(key, value.ToString());
            }
            return Task.CompletedTask;
        }

        public Task<T> GetPreferenceAsync<T>(string key, T defaultValue = default)
        {
            var val = Preferences.Default.Get(key, string.Empty);
            if (string.IsNullOrEmpty(val)) return Task.FromResult(defaultValue);
            try
            {
                return Task.FromResult((T)Convert.ChangeType(val, typeof(T)));
            }
            catch
            {
                return Task.FromResult(defaultValue);
            }
        }
    }
}
