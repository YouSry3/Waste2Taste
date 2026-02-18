using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Contract.Products;

namespace FoodRescue.BLL.Services.Products;

public interface IProductService
{
    Task<Result<IEnumerable<ProductListResponse>>> GetAllAsync(string? name);
    Task<Result<ProductDetailResponse>> GetByIdAsync(Guid id);
    Task<Result<IEnumerable<ProductListResponse>>> GetByVendorAsync(Guid vendorId);
    Task<Result<Guid>> CreateAsync(CreateProductRequest request);
    Task<Result> UpdateAsync(Guid id, UpdateProductRequest request);
    Task<Result> DeleteAsync(Guid id);
    Task<Result> UpdateStockAsync(Guid id, int quantity);
    Task<Result> MarkAsExpiredAsync(Guid id);
}
