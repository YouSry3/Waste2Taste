using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Contract.Vendors;

namespace FoodRescue.BLL.Services.Vendors;

public interface IVendorService
{
    Task<Result<List<VendorListResponse>>> GetVendorsAsync(string? name, string? status);
    Task<Result<VendorDetailsResponse>> GetVendorByIdAsync(Guid id);
    Task<Result<Guid>> CreateVendorAsync(CreateVendorRequest dto);
    Task<Result> UpdateVendorAsync(Guid id, UpdateVendorRequest dto);
    Task<Result> DeleteVendorAsync(Guid id);
    Task<Result<List<VendorProductResponse>>> GetVendorProductsAsync(Guid vendorId);
}
