using FoodRescue.DAL.Entities;

namespace FoodRescue.BLL.Extensions.Vendors;

public interface IVendorRepository
{
    Task<List<Vendor>> GetVendorsAsync(string? name, string? status);
    Task<Vendor?> GetVendorByIdAsync(Guid id);
    Task<Vendor?> GetByIdAsync(Guid id);
    Task<Vendor?> GetVendorWithProductsAsync(Guid id);
    Task AddAsync(Vendor vendor);
    Task UpdateAsync(Vendor vendor);
    Task DeleteAsync(Vendor vendor);
}
