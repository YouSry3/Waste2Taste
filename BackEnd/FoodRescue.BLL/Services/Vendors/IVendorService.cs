using FoodRescue.BLL.Contract.Vendors;

namespace FoodRescue.BLL.Services.Vendors;

public interface IVendorService
{
    Task<List<VendorListResponse>> GetVendorsAsync(string? name, string? status);
    Task<VendorDetailsResponse?> GetVendorByIdAsync(Guid id);
    Task<Guid> CreateVendorAsync(CreateVendorRequest dto);
    Task<bool> UpdateVendorAsync(Guid id, UpdateVendorRequest dto);
    Task<bool> DeleteVendorAsync(Guid id);
    Task<List<VendorProductResponse>> GetVendorProductsAsync(Guid vendorId);
}
