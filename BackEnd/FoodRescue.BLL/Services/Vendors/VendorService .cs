using FoodRescue.BLL.Contract.Vendors;
using FoodRescue.BLL.Extensions.Vendors;
using FoodRescue.DAL.Entities;
using Mapster;

namespace FoodRescue.BLL.Services.Vendors;

public class VendorService : IVendorService
{
    private readonly IVendorRepository _vendorRepository;

    public VendorService(IVendorRepository vendorRepository)
    {
        _vendorRepository = vendorRepository;
    }

    public async Task<List<VendorListResponse>> GetVendorsAsync(string? name, string? status)
    {
        var vendors = await _vendorRepository.GetVendorsAsync(name, status);
        return vendors.Adapt<List<VendorListResponse>>();
    }

    public async Task<VendorDetailsResponse?> GetVendorByIdAsync(Guid id)
    {
        var vendor = await _vendorRepository.GetVendorByIdAsync(id);
        return vendor?.Adapt<VendorDetailsResponse>();
    }

    public async Task<Guid> CreateVendorAsync(CreateVendorRequest dto)
    {
        var vendor = dto.Adapt<Vendor>();
        vendor.Id = Guid.NewGuid();
        vendor.CreatedAt = DateTime.UtcNow;

        await _vendorRepository.AddAsync(vendor);
        return vendor.Id;
    }

    public async Task<bool> UpdateVendorAsync(Guid id, UpdateVendorRequest dto)
    {
        var vendor = await _vendorRepository.GetByIdAsync(id);
        if (vendor == null) return false;

        if (dto.Name != null) vendor.Name = dto.Name;
        if (dto.Address != null) vendor.Address = dto.Address;
        if (dto.Status != null) vendor.Status = dto.Status;

        await _vendorRepository.UpdateAsync(vendor);
        return true;
    }

    public async Task<bool> DeleteVendorAsync(Guid id)
    {
        var vendor = await _vendorRepository.GetByIdAsync(id);
        if (vendor == null) return false;

        await _vendorRepository.DeleteAsync(vendor);
        return true;
    }

    public async Task<List<VendorProductResponse>> GetVendorProductsAsync(Guid vendorId)
    {
        throw new NotImplementedException();
        //var vendor = await _vendorRepository.GetVendorWithProductsAsync(vendorId);
        //return vendor?.Products.Adapt<List<VendorProductResponse>>() ?? new();
    }
}
