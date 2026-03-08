using FoodRescue.BLL.Contract.VendorDashboard;
using FoodRescue.BLL.ResultPattern.TypeErrors;
using FoodRescue.BLL.Services.FileStorage;
using FoodRescue.DAL.Consts;
using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FoodRescue.BLL.Services.Vendors;

public class VendorRequestService : IVendorRequestService
{
    private readonly CompanyDbContext _context;
    private readonly ILogger<VendorRequestService> _logger;
    private readonly IFileStorageService _fileStorage;

    public VendorRequestService(
        CompanyDbContext context,
        ILogger<VendorRequestService> logger,
        IFileStorageService fileStorage)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _fileStorage = fileStorage ?? throw new ArgumentNullException(nameof(fileStorage));
    }

    public async Task<Result<Guid>> CreateVendorRequestAsync(VendorDataRequest request, Guid userId)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            _logger.LogWarning("User {UserId} not found", userId);
            return Result.Failure<Guid>(VendorErrors.UserNotFound);
        }

        // Upload Business License
        string? businessLicenseUrl = null;
        if (request.BusinessLicenseFile != null)
        {
            var licenseResult = await _fileStorage.SaveDocumentAsync(request.BusinessLicenseFile, "licenses");
            if (licenseResult.IsFailure)
                return Result.Failure<Guid>(licenseResult.Error);
            businessLicenseUrl = licenseResult.Value;
        }

        // Upload Health Certificate
        string? healthCertificateUrl = null;
        if (request.HealthCertificateFile != null)
        {
            var certResult = await _fileStorage.SaveDocumentAsync(request.HealthCertificateFile, "health-certs");
            if (certResult.IsFailure)
            {
                // Rollback license upload if cert fails
                if (businessLicenseUrl != null)
                    await _fileStorage.DeleteDocumentAsync(businessLicenseUrl);
                return Result.Failure<Guid>(certResult.Error);
            }
            healthCertificateUrl = certResult.Value;
        }

        var vendorRequest = request.Adapt<VendorRequest>();
        vendorRequest.UserId = userId;
        vendorRequest.Status = VendorRequestStatus.Pending;
        vendorRequest.CreatedAt = DateTime.UtcNow;
        vendorRequest.BusinessLicenseUrl = businessLicenseUrl;
        vendorRequest.HealthCertificateUrl = healthCertificateUrl;

        _context.VendorRequests.Add(vendorRequest);
        await _context.SaveChangesAsync();

        return Result.Success(vendorRequest.Id);
    }

    public async Task<Result<VendorDataRequest>> GetVendorRequestAsync(Guid vendorRequestId)
    {
        _logger.LogInformation("Retrieving vendor request {VendorRequestId}", vendorRequestId);

        var vendorRequest = await _context.VendorRequests
            .Include(vr => vr.User)
            .FirstOrDefaultAsync(vr => vr.Id == vendorRequestId);

        if (vendorRequest == null)
        {
            _logger.LogWarning("Vendor request {VendorRequestId} not found", vendorRequestId);
            return Result.Failure<VendorDataRequest>(new Error("VendorRequestNotFound", "Vendor request not found"));
        }

        var response = MapToVendorDataRequest(vendorRequest);
        return Result<VendorDataRequest>.Success(response);
    }

    public async Task<Result<List<VendorDataRequest>>> GetPendingVendorRequestsAsync()
    {
        _logger.LogInformation("Retrieving pending vendor requests");

        var pendingRequests = await _context.VendorRequests
            .Where(vr => vr.Status == VendorRequestStatus.Pending)
            .Include(vr => vr.User)
            .OrderByDescending(vr => vr.CreatedAt)
            .ToListAsync();

        var responses = pendingRequests.Select(MapToVendorDataRequest).ToList();
        return Result<List<VendorDataRequest>>.Success(responses);
    }

    public async Task<Result> ApproveVendorRequestAsync(Guid vendorRequestId)
    {
        var vendorRequest = await _context.VendorRequests
            .FirstOrDefaultAsync(vr => vr.Id == vendorRequestId);

        if (vendorRequest == null)
        {
            _logger.LogWarning("Vendor request {VendorRequestId} not found", vendorRequestId);
            return Result.Failure(new Error("VendorRequestNotFound", "Vendor request not found"));
        }

        vendorRequest.Status = VendorRequestStatus.Approved;
        vendorRequest.ReviewedAt = DateTime.UtcNow;

        var vendor = vendorRequest.Adapt<Vendor>();
        vendor.Name = vendorRequest.BusinessName;
        vendor.OwnerId = vendorRequest.UserId;
        vendor.CreatedAt = DateTime.UtcNow;
        // REMOVED: vendor.Status = "active";  <-- Your Vendor doesn't have Status!
        // REMOVED: vendor.Role = "vendor";     <-- Not needed, already default

        _context.Vendors.Add(vendor);
        _context.VendorRequests.Update(vendorRequest);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Vendor request {VendorRequestId} approved and vendor created", vendorRequestId);
        return Result.Success();
    }

    public async Task<Result> RejectVendorRequestAsync(Guid vendorRequestId)
    {
        _logger.LogInformation("Rejecting vendor request {VendorRequestId}", vendorRequestId);

        var vendorRequest = await _context.VendorRequests
            .FirstOrDefaultAsync(vr => vr.Id == vendorRequestId);

        if (vendorRequest == null)
        {
            _logger.LogWarning("Vendor request {VendorRequestId} not found", vendorRequestId);
            return Result.Failure(VendorErrors.NotFound);
        }

        vendorRequest.Status = VendorRequestStatus.Rejected;
        vendorRequest.ReviewedAt = DateTime.UtcNow;

        _context.VendorRequests.Update(vendorRequest);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Vendor request {VendorRequestId} rejected", vendorRequestId);
        return Result.Success();
    }

    public async Task<Result<List<VendorDataRequest>>> GetAllVendorRequestsAsync(int page, int limit)
    {
        _logger.LogInformation("Retrieving vendor requests - Page: {Page}, Limit: {Limit}", page, limit);

        var skip = (page - 1) * limit;

        var vendorRequests = await _context.VendorRequests
            .Include(vr => vr.User)
            .OrderByDescending(vr => vr.CreatedAt)
            .Skip(skip)
            .Take(limit)
            .ToListAsync();

        var responses = vendorRequests.Select(MapToVendorDataRequest).ToList();
        return Result<List<VendorDataRequest>>.Success(responses);
    }

    private VendorDataRequest MapToVendorDataRequest(VendorRequest vendorRequest)
    {
        return new VendorDataRequest
        {
            Name = vendorRequest.BusinessName,
            Category = vendorRequest.Category,
            Email = vendorRequest.User?.Email ?? string.Empty,
            PhoneNumber = vendorRequest.PhoneNumber,
            Address = vendorRequest.Address,
            BusinessLicenseUrl = vendorRequest.BusinessLicenseUrl,
            HealthCertificateUrl = vendorRequest.HealthCertificateUrl,
        };
    }
}
