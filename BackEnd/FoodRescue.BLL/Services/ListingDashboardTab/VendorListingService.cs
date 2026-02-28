using FoodRescue.BLL.Contract.ListingDashboardDTOs;
using FoodRescue.BLL.Extensions.Dashboard.ListingDashboardTab;
using FoodRescue.DAL.Entities;
using FoodRescue.DAL.Models;

namespace FoodRescue.BLL.Services.ListingDashboardTab;

public class VendorListingService : IVendorListingService
{
    private readonly IVendorListingRepository _repository;

    public VendorListingService(IVendorListingRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<VendorListingListResponse>> GetListingsAsync(Guid vendorId, ListingFilter filter)
    {
        var products = await _repository.GetVendorListingsAsync(vendorId, filter);
        var activeCount = await _repository.GetActiveListingsCountAsync(vendorId);

        var listings = products.Select(p => MapToDto(p)).ToList();

        return Result.Success(new VendorListingListResponse
        {
            ActiveCount = activeCount,
            Listings = listings
        });
    }

    public async Task<Result<VendorListingDto?>> GetListingByIdAsync(Guid productId, Guid vendorId)
    {
        var product = await _repository.GetListingByIdAsync(productId, vendorId);

        if (product == null)
            return Result.Success<VendorListingDto?>(null);

        return Result.Success<VendorListingDto?>(MapToDto(product));
    }

    public async Task<Result<bool>> UpdateListingAsync(Guid productId, Guid vendorId, UpdateListingRequest request)
    {
        var product = await _repository.GetListingByIdAsync(productId, vendorId);

        if (product == null)
            return Result.Failure<bool>(new Error("NotFound", "Listing not found"));

        product.Name = request.Name;
        product.Description = request.Description;
        product.OriginalPrice = request.OriginalPrice;
        product.Price = request.SalePrice;
        product.Quantity = request.Quantity;

        var result = await _repository.UpdateListingAsync(product);
        return Result.Success(result);
    }

    public async Task<Result<bool>> DeleteListingAsync(Guid productId, Guid vendorId)
    {
        var result = await _repository.DeleteListingAsync(productId, vendorId);
        return Result.Success(result);
    }

    private static VendorListingDto MapToDto(Product p)
    {
        // Calculate status
        var status = (!p.Expired && p.Quantity > 0) ? "Active" : "Sold Out";

        // Calculate discount percentage
        var discount = p.OriginalPrice > 0
            ? (int)((p.OriginalPrice - p.Price) / p.OriginalPrice * 100)
            : 0;

        // Calculate rating from reviews
        var rating = p.Reviews?.Any() == true
            ? Math.Round(p.Reviews.Average(r => (double)r.Rating), 1)
            : 0;

        // Calculate pickup time (2 hours before expiry)
        var pickupTime = $"{p.ExpiryDate.AddHours(-2):h:mm tt} - {p.ExpiryDate:h:mm tt}";

        return new VendorListingDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Category = p.Category,
            ImageUrl = p.ImageUrl,
            OriginalPrice = p.OriginalPrice,
            SalePrice = p.Price,
            DiscountPercentage = discount,
            Quantity = p.Quantity,
            Status = status,
            Rating = rating,
            VendorName = p.Vendor?.Name ?? "Unknown",
            Location = p.Vendor?.Address ?? "Unknown",
            PickupTime = pickupTime
        };
    }
}