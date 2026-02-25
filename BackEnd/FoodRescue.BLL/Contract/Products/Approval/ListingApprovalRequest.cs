using FoodRescue.DAL.Consts;

namespace FoodRescue.BLL.Contract.Products.Approval;

public class ListingApprovalRequest
{
    public Guid ProductId { get; set; }
    public ProductStatus Status { get; set; }
    public string? RejectionReason { get; set; }
}
