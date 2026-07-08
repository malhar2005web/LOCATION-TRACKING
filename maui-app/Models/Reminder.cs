using SQLite;

namespace LocationTracker.Models
{
    [Table("reminders")]
    public class ReminderRecord
    {
        [PrimaryKey, AutoIncrement]
        public int LocalId { get; set; }

        [Column("id")]
        public string? Id { get; set; }

        [Column("client_name")]
        public string? ClientName { get; set; }

        [Column("reminder_time")]
        public string? ReminderTime { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("status")]
        public string? Status { get; set; } // 'Pending' | 'Completed'

        [Column("timestamp")]
        public string? Timestamp { get; set; }
    }
}
