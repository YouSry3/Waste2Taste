using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Contract.Products;

namespace FoodRescue.BLL.Services.Products;

public interface IProductService
{
    Task<Result<IEnumerable<ProductResponse>>> GetAllAsync(string? name, Guid? vendorId, bool? expired);
    Task<Result<ProductResponse>> GetByIdAsync(Guid id);
    Task<Result<Guid>> CreateAsync(CreateProductRequest request,Guid userId);
    Task<Result> UpdateAsync(Guid id, UpdateProductRequest request);
    Task<Result> DeleteAsync(Guid id);
    Task<Result> UpdateStockAsync(Guid id, int quantity);
}
