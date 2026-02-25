using FoodRescue.DAL.Entities;
using Microsoft.AspNetCore.Http;

namespace FoodRescue.BLL.Services.Products;

public interface IAISpoilageDetectionService
{
    Task<AISpoileRequest?> DetectSpoilageAsync(Guid productId, IFormFile imageFile);
}
