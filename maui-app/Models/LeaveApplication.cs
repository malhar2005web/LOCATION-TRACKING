namespace LocationTracker.Models
{
    public class LeaveApplication
    {
        public int Id { get; set; }
        public string? ClientId { get; set; }
        public string? ClientName { get; set; }
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
        public string? Reason { get; set; }
        public string? Status { get; set; } // 'Pending' | 'Approved' | 'Rejected'
        public string? CreatedAt { get; set; }
    }
}
