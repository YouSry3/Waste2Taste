using FoodRescue.DAL.Entities;

namespace FoodRescue.BLL.Extensions.Products;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetActiveAsync(string? name);           //  NEW: Non-expired, in stock
    Task<IEnumerable<Product>> GetByVendorAsync(Guid vendorId);        //  NEW
    Task<Product?> GetByIdAsync(Guid id);
    Task<Product?> GetByIdWithVendorAndReviewsAsync(Guid id);          //  NEW: Include Vendor + Reviews
    Task<Vendor?> GetVendorByIdAsync(Guid vendorId);                   //  NEW
    Task AddAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteAsync(Product product);
}
