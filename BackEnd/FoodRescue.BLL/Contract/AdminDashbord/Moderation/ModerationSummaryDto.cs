namespace FoodRescue.BLL.Contract.AdminDashbord.Moderation;

/// <summary>
/// Data Transfer Object containing the summary of moderation tasks for the admin dashboard.
/// Provides counts of items requiring admin attention and approval.
/// </summary>
public class ModerationSummaryDto
{
    
    public int ListingsToReviewCount { get; set; }

    
    public int FlaggedListingsCount { get; set; }

    
    public int PendingVendorRequestsCount { get; set; }

  
    public int OpenCustomerReportsCount { get; set; }

   
    public int TotalItemsForModeration => 
        ListingsToReviewCount + FlaggedListingsCount + PendingVendorRequestsCount + OpenCustomerReportsCount;

    
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
}
