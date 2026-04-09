using FoodRescue.BLL.Contract.Listings;
using FoodRescue.BLL.Contract.Products.Approval;
using FoodRescue.BLL.ResultPattern;
using FoodRescue.DAL.Entities;

namespace FoodRescue.BLL.Services.Products;

public interface IListingApprovalService
{
    Task<Result> ApproveListingAsync(Guid productId);
    Task<Result> RejectListingAsync(Guid productId, string rejectionReason);
    Task<Result<Product>> GetPendingListingAsync(Guid productId);
    Task<Result<IEnumerable<ListingsPindingResponse>>> GetAllPendingListingsAsync();
}
