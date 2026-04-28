using FoodRescue.BLL.Contract.Reviews;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Services.Reviews
{
    public class SentimentService : ISentimentService
    {
        private readonly HttpClient _httpClient;

        public SentimentService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<SentimentResponse> AnalyzeText(string text)
        {
            var response = await _httpClient.PostAsJsonAsync(
                "https://web-production-ab0306.up.railway.app/sentiment",
                new { text }
            );

            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<SentimentResponse>();
        }
    }
}
