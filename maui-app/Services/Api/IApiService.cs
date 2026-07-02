namespace LocationTracker.Services.Api
{
    public interface IApiService
    {
        Task<T?> RequestAsync<T>(string endpoint, HttpMethod method, object? payload = null);
        void SetAuthToken(string? token);
    }
}
