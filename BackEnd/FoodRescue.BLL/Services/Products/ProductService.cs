using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Abstractions.TypeErrors;
using FoodRescue.BLL.Contract.Products;
using FoodRescue.BLL.Extensions.Products;
using FoodRescue.BLL.Extensions.Users;
using FoodRescue.DAL.Entities;
using Mapster;

namespace FoodRescue.BLL.Services.Products;




public class ProductService : IProductService
{
    private readonly IProductRepository _repo;
    private readonly IUserRepository _userRepository;

    public ProductService(IProductRepository repo,IUserRepository userRepository)
    {
        _repo = repo;
        _userRepository = userRepository;
    }

    public async Task<Result<IEnumerable<ProductResponse>>> GetAllAsync(Guid? vendorId, bool? expired)
    {
        var products = await _repo.GetAllAsync( vendorId, expired);
        var response = products.Adapt<IEnumerable<ProductResponse>>();
        return Result.Success(response);
    }

    public async Task<Result<ProductResponse>> GetByIdAsync(Guid id)
    {
        var product = await _repo.GetByIdAsync(id);
        if (product is null)
            return Result.Failure<ProductResponse>(ProductErrors.NotFound);

        var response = product.Adapt<ProductResponse>();
        return Result.Success(response);
    }

    public async Task<Result<Guid>> CreateAsync(CreateProductRequest request)
    {
        bool vendorExists = await _repo.VendorExistsAsync(request.VendorId);
        if (!vendorExists)
            return Result.Failure<Guid>(ProductErrors.VendorNotFound);

        var product = request.Adapt<Product>();
        
        product.VendorId = request.VendorId;
        product.Expired = true;
        
        product.CreatedAt = DateTime.UtcNow;

        await _repo.AddAsync(product);

        return Result.Success(product.Id);
    }

    public async Task<Result> UpdateAsync(Guid id, UpdateProductRequest request)
    {
        var product = await _repo.GetByIdAsync(id);
        if (product is null)
            return Result.Failure(ProductErrors.NotFound);

        if (request.Name is not null)
            product.Name = request.Name;

        if (request.Price.HasValue)
            product.Price = request.Price.Value;

        if (request.Quantity.HasValue)
            product.Quantity = request.Quantity.Value;

        if (request.Expired.HasValue)
            product.Expired = request.Expired.Value;

        await _repo.UpdateAsync(product);

        return Result.Success();
    }

    public async Task<Result> DeleteAsync(Guid id)
    {
        var product = await _repo.GetByIdAsync(id);
        if (product is null)
            return Result.Failure(ProductErrors.NotFound);

        await _repo.DeleteAsync(product);
        return Result.Success();
    }

    public async Task<Result> UpdateStockAsync(Guid id, int quantity)
    {
        if (quantity < 0)
            return Result.Failure(ProductErrors.InvalidQuantity);

        var product = await _repo.GetByIdAsync(id);
        if (product is null)
            return Result.Failure(ProductErrors.NotFound);

        product.Quantity = quantity;

        await _repo.UpdateAsync(product);
        return Result.Success();
    }
}