using FoodRescue.DAL.Consts;
using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace FoodRescue.BLL.Services.Products;

public class AISpoilageDetectionService : IAISpoilageDetectionService
{
    private readonly HttpClient _httpClient;
    private readonly CompanyDbContext _context;
    private readonly ILogger<AISpoilageDetectionService> _logger;
    private const string AI_ENDPOINT = "https://web-production-ab0306.up.railway.app/predict";

    public AISpoilageDetectionService(
        HttpClient httpClient,
        CompanyDbContext context,
        ILogger<AISpoilageDetectionService> logger)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<AISpoileRequest?> DetectSpoilageAsync(Guid productId, IFormFile imageFile)
    {
        try
        {
            _logger.LogInformation("Starting AI spoilage detection for product {ProductId}", productId);

            // ✅ Copy to MemoryStream first
            using var memoryStream = new MemoryStream();
            await imageFile.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            using var content = new MultipartFormDataContent();
            var fileContent = new StreamContent(memoryStream);
            fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(imageFile.ContentType);
            content.Add(fileContent, "file", imageFile.FileName);

            var response = await _httpClient.PostAsync(AI_ENDPOINT, content);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("AI endpoint returned status {StatusCode} for product {ProductId}",
                    response.StatusCode, productId);
                return null;
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var aiResponse = JsonSerializer.Deserialize<AISpoilageResponse>(
                responseContent,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (aiResponse == null)
            {
                _logger.LogWarning("Failed to deserialize AI response for product {ProductId}", productId);
                return null;
            }

            var aiSpoileRequest = new AISpoileRequest
            {
                Id = Guid.NewGuid(),
                ProductId = productId,
                Prediction = aiResponse.Prediction ?? "Unknown",
                Confidence = (decimal)aiResponse.Confidence,
                SpoiledPercentage = (int)aiResponse.SpoiledPercentage,
                IsSpoiled = aiResponse.IsSpoiled,
                CreatedAt = DateTime.UtcNow
            };

            await _context.AISpoileRequests.AddAsync(aiSpoileRequest);
            await _context.SaveChangesAsync();

            _logger.LogInformation(
                "AI spoilage detection completed for product {ProductId}. IsSpoiled: {IsSpoiled}, Confidence: {Confidence}",
                productId, aiResponse.IsSpoiled, aiResponse.Confidence);

            return aiSpoileRequest;
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP error during AI spoilage detection for product {ProductId}", productId);
            return null;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "JSON deserialization error during AI spoilage detection for product {ProductId}", productId);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during AI spoilage detection for product {ProductId}", productId);
            return null;
        }
    }

}

internal class AISpoilageResponse
{
    [JsonPropertyName("prediction")]
    public string? Prediction { get; set; }

    [JsonPropertyName("confidence")]
    public double Confidence { get; set; }

    [JsonPropertyName("spoiled_percentage")]
    public double SpoiledPercentage { get; set; }

    [JsonPropertyName("is_spoiled")]
    public bool IsSpoiled { get; set; }
}
