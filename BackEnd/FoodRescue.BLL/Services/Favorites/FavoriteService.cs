using FoodRescue.BLL.Contract.Products;
using FoodRescue.BLL.Extensions.Favorites;
using FoodRescue.BLL.Extensions.Products;
using FoodRescue.BLL.ResultPattern;
using FoodRescue.BLL.ResultPattern.TypeErrors;
using FoodRescue.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FoodRescue.BLL.Services.Favorites;

public class FavoriteService : IFavoriteService
{
    private readonly IFavoriteRepository _favoriteRepository;
    private readonly IProductRepository _productRepository;
    private readonly ILogger<FavoriteService> _logger;

    public FavoriteService(
        IFavoriteRepository favoriteRepository,
        IProductRepository productRepository,
        ILogger<FavoriteService> logger)
    {
        _favoriteRepository = favoriteRepository;
        _productRepository = productRepository;
        _logger = logger;
    }

    public async Task<Result<string>> ToggleFavoriteAsync(Guid userId, Guid productId)
    {
        try
        {
            // Check if product exists
            var product = await _productRepository.GetByIdAsync(productId);
            if (product == null)
                return Result.Failure<string>(ProductErrors.NotFound);

            // Check if favorite already exists
            var existingFavorite = await _favoriteRepository.GetByUserAndProductAsync(userId, productId);

            if (existingFavorite != null)
            {
                // Remove favorite
                await _favoriteRepository.RemoveAsync(existingFavorite);
                var saved = await _favoriteRepository.SaveChangesAsync();
                if (!saved)
                    return Result.Failure<string>(new Error("FavoriteError", "Failed to remove favorite"));

                return Result.Success("Favorite removed successfully");
            }
            else
            {
                // Add favorite
                var favorite = new Favorite
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    ProductId = productId,
                    CreatedAt = DateTime.UtcNow
                };

                await _favoriteRepository.AddAsync(favorite);
                var saved = await _favoriteRepository.SaveChangesAsync();
                if (!saved)
                    return Result.Failure<string>(new Error("FavoriteError", "Failed to add favorite"));

                return Result.Success("Favorite added successfully");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling favorite for user {UserId} and product {ProductId}", userId, productId);
            return Result.Failure<string>(new Error("FavoriteError", "An error occurred while toggling favorite"));
        }
    }

    public async Task<Result<IEnumerable<ProductListResponse>>> GetUserFavoritesAsync(Guid userId)
    {
        try
        {
            var favoriteProducts = await _favoriteRepository.GetUserFavoritesAsync(userId);
            var response = new List<ProductListResponse>();

            foreach (var product in favoriteProducts)
            {
                var reviews = product.Reviews.ToList();
                var avgRating = reviews.Any() ? reviews.Average(r => (double)r.Rating) : 0.0;
                var totalReviews = reviews.Count;

                response.Add(new ProductListResponse
                {
                    Id = product.Id,
                    Name = product.Name,
                    ImageUrl = product.ImageUrl,
                    Price = product.Price,
                    Descripcion = product.Description,
                    OriginalPrice = product.OriginalPrice,
                    DiscountPercentage = CalculateDiscountPercentage(product.OriginalPrice, product.Price),
                    ExpiresIn = CalculateExpiresIn(product.ExpiryDate),
                    Rating = Math.Round(avgRating, 1),
                    TotalReviews = totalReviews,
                    VendorId = product.VendorId,
                    VendorName = product.Vendor.Name,
                    Category = product.Category,
                    Latitude = product.Vendor.Latitude,
                    Longitude = product.Vendor.Longitude,
                    IsFavorite = true
                });
            }

            return Result.Success(response.AsEnumerable());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving favorites for user {UserId}", userId);
            return Result.Failure<IEnumerable<ProductListResponse>>(
                new Error("FavoriteError", "An error occurred while retrieving favorites"));
        }
    }

    private static string CalculateExpiresIn(DateTime expiryDate)
    {
        var timeLeft = expiryDate - DateTime.Now;

        if (timeLeft.TotalMinutes <= 0)
            return "Expired";
        if (timeLeft.TotalHours < 1)
            return $"{(int)timeLeft.TotalMinutes}m left";
        if (timeLeft.TotalHours < 24)
            return $"{(int)timeLeft.TotalHours}h left";
        return $"{(int)timeLeft.TotalDays}d left";
    }

    private static int CalculateDiscountPercentage(decimal originalPrice, decimal currentPrice)
    {
        if (originalPrice <= 0 || currentPrice >= originalPrice) return 0;
        return (int)((originalPrice - currentPrice) / originalPrice * 100);
    }
}
