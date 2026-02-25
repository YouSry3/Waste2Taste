using FoodRescue.BLL.Contract.VendorDashboard;
using FoodRescue.BLL.ResultPattern;

namespace FoodRescue.BLL.Services.Vendors;

public interface IVendorRequestService
{
    Task<Result<Guid>> CreateVendorRequestAsync(VendorDataRequest request, Guid userId);
    Task<Result<VendorDataRequest>> GetVendorRequestAsync(Guid vendorRequestId);
    Task<Result<List<VendorDataRequest>>> GetPendingVendorRequestsAsync();
    Task<Result> ApproveVendorRequestAsync(Guid vendorRequestId, Guid adminId);
    Task<Result> RejectVendorRequestAsync(Guid vendorRequestId, Guid adminId);
    Task<Result<List<VendorDataRequest>>> GetAllVendorRequestsAsync(int page, int limit);
}
