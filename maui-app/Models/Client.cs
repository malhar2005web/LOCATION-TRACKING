namespace LocationTracker.Models
{
    public class Client
    {
        public string? ClientId { get; set; }
        public string? DeviceId { get; set; }
        public string? Name { get; set; }
        public bool IsActive { get; set; }
        public DateTime? CreatedAt { get; set; }
    }

    public class LoginResponse
    {
        public string? Token { get; set; }
        public string? Message { get; set; }
        public string? Role { get; set; }
        public ClientData? User { get; set; }
    }

    public class ClientData
    {
        public string? ClientId { get; set; }
        public string? Name { get; set; }
        public string? Role { get; set; }
    }
}
