using FoodRescue.BLL.Contract.VendorDashboard;
using FoodRescue.BLL.ResultPattern;
using FoodRescue.BLL.ResultPattern.TypeErrors;
using FoodRescue.DAL.Context;
using FoodRescue.DAL.Consts;
using FoodRescue.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Mapster;

namespace FoodRescue.BLL.Services.Vendors;

public class VendorRequestService : IVendorRequestService
{
    private readonly CompanyDbContext _context;
    private readonly ILogger<VendorRequestService> _logger;

    public VendorRequestService(CompanyDbContext context, ILogger<VendorRequestService> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<Result<Guid>> CreateVendorRequestAsync(VendorDataRequest request, Guid userId)
    {
      

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                _logger.LogWarning("User {UserId} not found", userId);
                return Result.Failure<Guid>(VendorErrors.UserNotFound);
        }

        var vendorRequest = request.Adapt<VendorRequest>();
        vendorRequest.UserId = userId;
        vendorRequest.Status = VendorRequestStatus.Pending;
        vendorRequest.CreatedAt = DateTime.UtcNow;
            

            _context.VendorRequests.Add(vendorRequest);
            await _context.SaveChangesAsync();

            return Result.Success(vendorRequest.Id);
        
        
        
    }

    public async Task<Result<VendorDataRequest>> GetVendorRequestAsync(Guid vendorRequestId)
    {
        try
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
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving vendor request");
            return Result.Failure<VendorDataRequest>(new Error("VendorRequestRetrievalError", "An error occurred while retrieving the vendor request"));
        }
    }

    public async Task<Result<List<VendorDataRequest>>> GetPendingVendorRequestsAsync()
    {
        try
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
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving pending vendor requests");
            return Result.Failure<List<VendorDataRequest>>(new Error("PendingRequestsRetrievalError", "An error occurred while retrieving pending requests"));
        }
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
        vendor.Role = "vendor";


        _context.Vendors.Add(vendor);
        _context.VendorRequests.Update(vendorRequest);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Vendor request {VendorRequestId} approved and vendor created", vendorRequestId);
        return Result.Success();
    }
        
       

    public async Task<Result> RejectVendorRequestAsync(Guid vendorRequestId)
    {
        try
        {
            _logger.LogInformation("Rejecting vendor request {VendorRequestId}", vendorRequestId );

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
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error rejecting vendor request");
            return Result.Failure(new Error("VendorRequestRejectionError", "An error occurred while rejecting the vendor request"));
        }
    }

    public async Task<Result<List<VendorDataRequest>>> GetAllVendorRequestsAsync(int page, int limit)
    {
        try
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
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving vendor requests");
            return Result.Failure<List<VendorDataRequest>>(new Error("VendorRequestsRetrievalError", "An error occurred while retrieving vendor requests"));
        }
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
