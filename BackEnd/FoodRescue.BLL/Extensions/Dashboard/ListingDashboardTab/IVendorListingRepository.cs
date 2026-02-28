using FoodRescue.DAL.Entities;
using FoodRescue.DAL.Models;

namespace FoodRescue.BLL.Extensions.Dashboard.ListingDashboardTab;

public interface IVendorListingRepository
{
    Task<List<Product>> GetVendorListingsAsync(Guid vendorId, ListingFilter filter);
    Task<Product?> GetListingByIdAsync(Guid productId, Guid vendorId);
    Task<bool> UpdateListingAsync(Product product);
    Task<bool> DeleteListingAsync(Guid productId, Guid vendorId);
    Task<int> GetActiveListingsCountAsync(Guid vendorId);
}
