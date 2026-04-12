using FoodRescue.BLL.Contract.Products;
using FoodRescue.BLL.ResultPattern.TypeErrors;
using FoodRescue.BLL.Services.FileStorage;
using FoodRescue.DAL.Consts;
using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FoodRescue.BLL.Services.Products;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly CompanyDbContext _context;
    private readonly IFileStorageService _fileStorage;
    private readonly IAISpoilageDetectionService _aiDetectionService;
    private readonly ILogger<ProductService> _logger;

    public ProductService(
        IProductRepository productRepository,
        CompanyDbContext context,
        IFileStorageService fileStorage,
        IAISpoilageDetectionService aiDetectionService,
        ILogger<ProductService> logger)
    {
        _productRepository = productRepository;
        _context = context;
        _fileStorage = fileStorage ?? throw new ArgumentNullException(nameof(fileStorage));
        _aiDetectionService = aiDetectionService ?? throw new ArgumentNullException(nameof(aiDetectionService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    private async Task<List<Review>> GetReviewsByProductIdAsync(Guid productId)
    {
        return await _context.Reviews
            .AsNoTracking()
            .Where(r => r.ProductId == productId)
            .ToListAsync();
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

    public async Task<Result<IEnumerable<ProductListResponse>>> GetAllAsync(string? name)
    {
        var products = await _productRepository.GetActiveAsync(name);
        var response = new List<ProductListResponse>();

        foreach (var product in products)
        {
            var reviews = await GetReviewsByProductIdAsync(product.Id);
            var avgRating = reviews.Any() ? reviews.Average(r => (double)r.Rating) : 0.0;

            response.Add(new ProductListResponse
            {
                Id = product.Id,
                Name = product.Name,
                ImageUrl = product.ImageUrl,
                Price = product.Price,
                OriginalPrice = product.OriginalPrice,
                DiscountPercentage = CalculateDiscountPercentage(product.OriginalPrice, product.Price),
                ExpiresIn = CalculateExpiresIn(product.ExpiryDate),
                Rating = Math.Round(avgRating, 1),
                VendorName = product.Vendor.Name,

                Latitude = product.Vendor.Latitude,
                Longitude = product.Vendor.Longitude
            });
        }

        return Result.Success(response.AsEnumerable());
    }

    public async Task<Result<ProductDetailResponse>> GetByIdAsync(Guid id)
    {
        var product = await _productRepository.GetByIdWithVendorAndReviewsAsync(id);

        if (product == null)
            return Result.Failure<ProductDetailResponse>(ProductErrors.NotFound);

        var reviews = product.Reviews.ToList();
        var avgRating = reviews.Any() ? reviews.Average(r => (double)r.Rating) : 0.0;

        return Result.Success(new ProductDetailResponse
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            ImageUrl = product.ImageUrl,
            Price = product.Price,
            OriginalPrice = product.OriginalPrice,
            DiscountPercentage = CalculateDiscountPercentage(product.OriginalPrice, product.Price),
            ExpiresIn = CalculateExpiresIn(product.ExpiryDate),
            Rating = Math.Round(avgRating, 1),
            ReviewCount = reviews.Count,
            VendorName = product.Vendor.Name,
            VendorId = product.VendorId,
            Quantity = product.Quantity,
            Expired = product.Expired,
            ExpiryDate = product.ExpiryDate
        });
    }

    public async Task<Result<IEnumerable<ProductListResponse>>> GetByVendorAsync(Guid vendorId)
    {
        var products = await _productRepository.GetByVendorAsync(vendorId);
        var response = new List<ProductListResponse>();

        foreach (var product in products)
        {
            var reviews = await GetReviewsByProductIdAsync(product.Id);
            var avgRating = reviews.Any() ? reviews.Average(r => (double)r.Rating) : 0.0;

            response.Add(new ProductListResponse
            {
                Id = product.Id,
                Name = product.Name,
                ImageUrl = product.ImageUrl,
                Price = product.Price,
                OriginalPrice = product.OriginalPrice,
                DiscountPercentage = CalculateDiscountPercentage(product.OriginalPrice, product.Price),
                ExpiresIn = CalculateExpiresIn(product.ExpiryDate),
                Rating = Math.Round(avgRating, 1),
                VendorName = product.Vendor.Name
            });
        }

        return Result.Success(response.AsEnumerable());
    }

    public async Task<Result<Guid>> CreateAsync(CreateProductRequest request)
    {
        var vendor = await _productRepository.GetVendorByIdAsync(request.VendorId);

        if (vendor is null)
            return Result.Failure<Guid>(ProductErrors.VendorNotFound);

        // Save image using unified file storage service
        var imageResult = await _fileStorage.SaveImageAsync(request.ImageFile, "products");
        if (imageResult.IsFailure)
            return Result.Failure<Guid>(imageResult.Error);

        var product = request.Adapt<Product>();
        product.ImageUrl = imageResult.Value;
        product.Expired = false;
        product.Status = ProductStatus.Pending;
        product.CreatedAt = DateTime.UtcNow;

        await _productRepository.AddAsync(product);

        _logger.LogInformation("Product created with ID {ProductId}. Starting AI spoilage detection...", product.Id);

        ///   add in future: Background job to handle this instead of awaiting in the request flow
        await _aiDetectionService.DetectSpoilageAsync(product.Id, request.ImageFile);




        return Result.Success(product.Id);
    }

    public async Task<Result> UpdateAsync(Guid id, UpdateProductRequest request)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product == null)
            return Result.Failure(ProductErrors.NotFound);

        // Update scalar properties
        if (request.Name != null)
            product.Name = request.Name;

        if (request.Description != null)
            product.Description = request.Description;

        if (request.Price.HasValue)
            product.Price = request.Price.Value;

        if (request.OriginalPrice.HasValue)
            product.OriginalPrice = request.OriginalPrice.Value;

        if (request.Quantity.HasValue)
            product.Quantity = request.Quantity.Value;

        if (request.ExpiryDate.HasValue)
            product.ExpiryDate = request.ExpiryDate.Value;

        if (request.Expired.HasValue)
            product.Expired = request.Expired.Value;

        // Handle image update using unified file storage service
        if (request.ImageFile != null)
        {
            var deleteResult = await _fileStorage.DeleteImageAsync(product.ImageUrl);
            // Continue even if delete fails (file might not exist)

            var imageResult = await _fileStorage.SaveImageAsync(request.ImageFile, "products");
            if (imageResult.IsFailure)
                return Result.Failure(imageResult.Error);

            product.ImageUrl = imageResult.Value;
        }

        await _productRepository.UpdateAsync(product);
        return Result.Success();
    }

    public async Task<Result> DeleteAsync(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product == null)
            return Result.Failure(ProductErrors.NotFound);

        // Delete image using unified file storage service
        await _fileStorage.DeleteImageAsync(product.ImageUrl);

        await _productRepository.DeleteAsync(product);

        return Result.Success();
    }

    public async Task<Result> UpdateStockAsync(Guid id, int quantity)
    {
        if (quantity < 0)
            return Result.Failure(ProductErrors.InvalidQuantity);

        var product = await _productRepository.GetByIdAsync(id);

        if (product == null)
            return Result.Failure(ProductErrors.NotFound);

        product.Quantity = quantity;
        await _productRepository.UpdateAsync(product);

        return Result.Success();
    }

    public async Task<Result> MarkAsExpiredAsync(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product == null)
            return Result.Failure(ProductErrors.NotFound);

        product.Expired = true;
        await _productRepository.UpdateAsync(product);

        return Result.Success();
    }
}