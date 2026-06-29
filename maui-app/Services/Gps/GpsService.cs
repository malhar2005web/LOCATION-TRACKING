namespace LocationTracker.Services.Gps
{
    public class GpsService : IGpsService
    {
        public async Task<Microsoft.Maui.Devices.Sensors.Location> GetCurrentLocationAsync()
        {
            try
            {

                var status = await Permissions.CheckStatusAsync<Permissions.LocationWhenInUse>();
                if (status != PermissionStatus.Granted)
                {
                    status = await Permissions.RequestAsync<Permissions.LocationWhenInUse>();
                    if (status != PermissionStatus.Granted)
                    {
                        return null;
                    }
                }

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
