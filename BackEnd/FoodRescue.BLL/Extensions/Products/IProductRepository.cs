using FoodRescue.DAL.Entities;

namespace FoodRescue.BLL.Extensions.Products;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync(string? name, Guid? vendorId, bool? expired);
    Task<Product?> GetByIdAsync(Guid id);
    Task AddAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteAsync(Product product);
    Task<bool> VendorExistsAsync(Guid vendorId);
}
