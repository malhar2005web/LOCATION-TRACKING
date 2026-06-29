using SQLite;

namespace LocationTracker.Models
{
    [Table("dsr_records")]
    public class DsrRecord
    {
        [PrimaryKey, AutoIncrement]
        public int LocalId { get; set; }

        [Column("client")]
        public string? Client { get; set; }

        [Column("contact_person")]
        public string? ContactPerson { get; set; }

        [Column("remark")]
        public string? Remark { get; set; }

        [Column("followup")]
        public string? Followup { get; set; }

        [Column("latitude")]
        public double Latitude { get; set; }

        [Column("longitude")]
        public double Longitude { get; set; }

        [Column("is_others")]
        public bool IsOthers { get; set; }

        [Column("is_new_client")]
        public bool IsNewClient { get; set; }

        [Column("visited_by")]
        public string? VisitedBy { get; set; }

        [Column("status")]
        public string? Status { get; set; }

        [Column("timestamp")]
        public string? Timestamp { get; set; }

        [Column("is_synced")]
        public bool IsSynced { get; set; }
    }
}
