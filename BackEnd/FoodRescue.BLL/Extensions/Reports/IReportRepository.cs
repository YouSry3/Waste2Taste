using FoodRescue.DAL.Entities;

namespace FoodRescue.BLL.Extensions.Reports
{
    public interface IReportRepository
    {
        // Report Operations
        Task<Report?> GetByIdAsync(Guid id);
        Task<IEnumerable<Report>> GetAllAsync();
        Task<IEnumerable<Report>> GetByStatusAsync(string status);
        Task<IEnumerable<Report>> GetByUserIdAsync(Guid userId);
        Task<IEnumerable<Report>> SearchAsync(string? customerName = null, Guid? orderId = null, string? listingName = null);
        Task<IEnumerable<Report>> GetFilteredAsync(string? status = null, string? priority = null, string? search = null);
        Task AddAsync(Report report);
        Task UpdateAsync(Report report);
        Task DeleteAsync(Guid id);

        // Report Response Operations
        Task<ReportResponse?> GetResponseByIdAsync(Guid id);
        Task<IEnumerable<ReportResponse>> GetResponsesByReportIdAsync(Guid reportId);
        Task AddResponseAsync(ReportResponse response);

        // Stats Operations
        Task<int> GetTotalReportsAsync();
        Task<int> GetReportCountByStatusAsync(string status);
        Task<int> GetReportCountByPriorityAsync(string priority);
        Task<decimal> GetTotalRefundAmountAsync();
        Task<string> GenerateReportCodeAsync();
    }
}
