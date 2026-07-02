namespace LocationTracker.Services.Gps
{
    public class GpsService : IGpsService
    {
        public async Task<Microsoft.Maui.Devices.Sensors.Location> GetCurrentLocationAsync()
        {
            try
            {
                // Direct geolocation lookup, permissions are handled separately on app startup to avoid dispatcher re-entrancy crashes

                var request = new GeolocationRequest(GeolocationAccuracy.High, TimeSpan.FromSeconds(10));
                var location = await Geolocation.Default.GetLocationAsync(request);
                
                return location;
            }
            catch (FeatureNotSupportedException)
            {
                System.Diagnostics.Debug.WriteLine("[GPS] Location services not supported on device.");
            }
            catch (FeatureNotEnabledException)
            {
                System.Diagnostics.Debug.WriteLine("[GPS] Location services not enabled on device.");
            }
            catch (PermissionException)
            {
                System.Diagnostics.Debug.WriteLine("[GPS] Location permissions denied.");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[GPS] Location fetch failed: {ex.Message}");
            }
            return null;
        }
    }
}
