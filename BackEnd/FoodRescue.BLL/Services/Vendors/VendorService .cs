using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Abstractions.TypeErrors;
using FoodRescue.BLL.Contract.Vendors;
using FoodRescue.BLL.Extensions.Users;
using FoodRescue.BLL.Extensions.Vendors;
using FoodRescue.DAL.Entities;
using Mapster;
using System.Security.Claims;

namespace FoodRescue.BLL.Services.Vendors;

public class VendorService(IVendorRepository vendorRepository, IUserRepository userRepository) : IVendorService
{
    private readonly IVendorRepository _vendorRepository = vendorRepository;
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<Result<List<VendorListResponse>>> GetVendorsAsync(string? name, string? status)
    {
        var vendors = await _vendorRepository.GetVendorsAsync(name, status);
        var response = vendors.Adapt<List<VendorListResponse>>();

        return Result.Success(response);
    }

    public async Task<Result<VendorDetailsResponse>> GetVendorByIdAsync(Guid id)
    {
        var vendor = await _vendorRepository.GetVendorByIdAsync(id);

        if (vendor is null)
            return Result.Failure<VendorDetailsResponse>(VendorErrors.NotFound);

        var response = vendor.Adapt<VendorDetailsResponse>();
        return Result.Success(response);
    }

    public async Task<Result<Guid>> CreateVendorAsync(CreateVendorRequest dto)
    {
        
        //can you check Authorization here? Vendor must be created by a Vendor user
        var isVendor = await _userRepository.IsVendor(dto.OwnerId);

        // or check By JWT in Controller Sent By Request in Authorization Bearer
        //      like this in VenderController to get userId: from token"JWT"
        //Guid userId = Guid.Parse(
        //       User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        //   );

        if (!isVendor)
            return Result.Failure<Guid>(VendorErrors.OwnerMustBeVendor(dto.OwnerId));

        if (string.IsNullOrWhiteSpace(dto.Name))
            return Result.Failure<Guid>(VendorErrors.NameRequired);

        var vendor = dto.Adapt<Vendor>();
        vendor.Id = Guid.NewGuid();
        vendor.CreatedAt = DateTime.UtcNow;

        await _vendorRepository.AddAsync(vendor);

        return Result.Success(vendor.Id);
    }

    public async Task<Result> UpdateVendorAsync(Guid id, UpdateVendorRequest dto)
    {
        var vendor = await _vendorRepository.GetByIdAsync(id);

        if (vendor is null)
            return Result.Failure(VendorErrors.NotFound);

        if (dto.Name is not null)
            vendor.Name = dto.Name;

        if (dto.Address is not null)
            vendor.Address = dto.Address;

        if (dto.Status is not null)
            vendor.Status = dto.Status;

        await _vendorRepository.UpdateAsync(vendor);

        return Result.Success();
    }

    public async Task<Result> DeleteVendorAsync(Guid id)
    {
        var vendor = await _vendorRepository.GetByIdAsync(id);

        if (vendor is null)
            return Result.Failure(VendorErrors.NotFound);

        await _vendorRepository.DeleteAsync(vendor);

        return Result.Success();
    }

    public async Task<Result<List<VendorProductResponse>>> GetVendorProductsAsync(Guid vendorId)
    {
        var vendor = await _vendorRepository.GetVendorWithProductsAsync(vendorId);

        if (vendor is null)
            return Result.Failure<List<VendorProductResponse>>(VendorErrors.NotFound);

        var response = vendor.Products.Adapt<List<VendorProductResponse>>();
        return Result.Success(response);
    }
}
