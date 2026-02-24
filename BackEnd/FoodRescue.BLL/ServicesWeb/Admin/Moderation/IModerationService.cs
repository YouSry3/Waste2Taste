using FoodRescue.BLL.Contract.AdminDashbord.Moderation;

namespace FoodRescue.BLL.ServicesWeb.Admin.Moderation;

/// <summary>
/// Interface for moderation-related services in the admin dashboard.
/// Provides methods to retrieve moderation summary and related metrics.
/// </summary>
public interface IModerationService
{
    /// <summary>
    /// Retrieves a summary of all items requiring moderation attention.
    /// </summary>
    /// <remarks>
    /// This method queries multiple repositories to count:
    /// - Pending product listings
    /// - Flagged listings
    /// - Pending vendor requests
    /// - Open customer reports
    /// </remarks>
    /// <returns>A task that represents the asynchronous operation. 
    /// The task result contains a ModerationSummaryDto with all moderation counts.</returns>
    Task<ModerationSummaryDto> GetModerationSummaryAsync();

    /// <summary>
    /// Retrieves the count of product listings awaiting admin approval.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation. 
    /// The task result contains the count of pending listings.</returns>
    Task<int> GetListingsToReviewCountAsync();

    /// <summary>
    /// Retrieves the count of flagged product listings.
    /// </summary>
    /// <remarks>
    /// A listing is flagged when the AI spoilage detection system identifies issues
    /// or when a listing is manually marked as problematic by moderators.
    /// </remarks>
    /// <returns>A task that represents the asynchronous operation. 
    /// The task result contains the count of flagged listings.</returns>
    Task<int> GetFlaggedListingsCountAsync();

    /// <summary>
    /// Retrieves the count of vendor requests awaiting admin approval.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation. 
    /// The task result contains the count of pending vendor requests.</returns>
    Task<int> GetPendingVendorRequestsCountAsync();

    /// <summary>
    /// Retrieves the count of open customer reports requiring investigation.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation. 
    /// The task result contains the count of open customer reports.</returns>
    Task<int> GetOpenCustomerReportsCountAsync();
}
