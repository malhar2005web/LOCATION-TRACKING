namespace LocationTracker.Services.Gps
{
    public interface IGpsService
    {
        Task<Microsoft.Maui.Devices.Sensors.Location> GetCurrentLocationAsync();
    }
}
