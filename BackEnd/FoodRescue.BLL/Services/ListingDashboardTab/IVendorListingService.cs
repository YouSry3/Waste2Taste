using FoodRescue.BLL.Contract.ListingDashboardDTOs;
using FoodRescue.DAL.Models;

namespace FoodRescue.BLL.Services.ListingDashboardTab;

public interface IVendorListingService
{
    Task<Result<VendorListingListResponse>> GetListingsAsync(Guid vendorId, ListingFilter filter);
    Task<Result<VendorListingDto?>> GetListingByIdAsync(Guid productId, Guid vendorId);
    Task<Result<bool>> UpdateListingAsync(Guid productId, Guid vendorId, UpdateListingRequest request);
    Task<Result<bool>> DeleteListingAsync(Guid productId, Guid vendorId);
}
