using System.Net.Http.Headers;
using System.Net.Http.Json;
using LocationTracker.Services.Storage;

namespace LocationTracker.Services.Api
{
    public class ApiService : IApiService
    {
        private readonly HttpClient _httpClient;
        private readonly IStorageService _storageService;
        private readonly string _apiBaseUrl = "https://fleettrackon.co.in/skywaydia";

        public ApiService(IStorageService storageService)
        {
            _storageService = storageService;
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Add("Bypass-Tunnel-Reminder", "true");
        }

        public void SetAuthToken(string? token)
        {
            if (!string.IsNullOrEmpty(token))
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            else
                _httpClient.DefaultRequestHeaders.Authorization = null;
        }

        public async Task<T?> RequestAsync<T>(string endpoint, HttpMethod method, object? payload = null)
        {

            var token = await _storageService.GetPreferenceAsync<string?>("auth_token");
            SetAuthToken(token);

            var request = new HttpRequestMessage(method, $"{_apiBaseUrl}{endpoint}");
            
            if (payload != null && (method == HttpMethod.Post || method == HttpMethod.Put || method == HttpMethod.Patch))
            {
                request.Content = JsonContent.Create(payload);
            }

            try
            {
                var response = await _httpClient.SendAsync(request);

                if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {
                    await _storageService.SetPreferenceAsync<string?>("auth_token", null);
                    await _storageService.SetPreferenceAsync<string?>("user_role", null);
                    await _storageService.SetPreferenceAsync<string?>("user_data", null);

                    throw new UnauthorizedAccessException("Session expired. Please login again.");
                }

                if (!response.IsSuccessStatusCode)
                {
                    var errorResponse = await response.Content.ReadFromJsonAsync<ErrorPayload>();
                    var errorMsg = errorResponse?.Message ?? $"Request failed with status: {response.StatusCode}";
                    throw new HttpRequestException(errorMsg, null, response.StatusCode);
                }

                if (response.StatusCode == System.Net.HttpStatusCode.NoContent)
                {
                    return default;
                }

                return await response.Content.ReadFromJsonAsync<T>();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[API Error] endpoint={endpoint}: {ex.Message}");
                throw;
            }
        }
    }

    public class ErrorPayload
    {
        public string? Message { get; set; }
    }
}
