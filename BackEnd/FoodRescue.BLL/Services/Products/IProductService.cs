using FoodRescue.BLL.ResultPattern;
using FoodRescue.BLL.Contract.Products;
using Microsoft.AspNetCore.Http;

namespace FoodRescue.BLL.Services.Products;

public interface IProductService
{
    Task<Result<IEnumerable<ProductListResponse>>> GetAllAsync(string? name);
    Task<Result<IEnumerable<ProductListResponse>>> GetAllAsync(string? name, Guid? userId);
    Task<Result<ProductDetailResponse>> GetByIdAsync(Guid id);
    Task<Result<IEnumerable<ProductListResponse>>> GetByVendorAsync(Guid vendorId);
    Task<Result<Guid>> CreateAsync(CreateProductRequest request);
    Task<Result> UpdateAsync(Guid id, UpdateProductRequest request);
    Task<Result> DeleteAsync(Guid id);
    Task<Result> UpdateStockAsync(Guid id, int quantity);
    Task<Result> MarkAsExpiredAsync(Guid id);
}
