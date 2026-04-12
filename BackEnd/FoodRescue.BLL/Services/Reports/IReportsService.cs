using FoodRescue.BLL.Contract.Reports.Create;
using FoodRescue.BLL.Contract.Reports.Update;
using FoodRescue.BLL.Contract.Reports.Get;
using FoodRescue.BLL.Contract.Reports.Response;
using FoodRescue.BLL.Contract.Reports.Stats;
using FoodRescue.BLL.ResultPattern;
using FoodRescue.DAL.Entities;

namespace FoodRescue.BLL.Services.Reports
{
    public interface IReportsService
    {
        // Get Operations
        Task<Result<IEnumerable<ReportListDto>>> GetAllReportsAsync();
        Task<Result<IEnumerable<ReportListDto>>> GetReportsByUserAsync(Guid userId);
        Task<Result<ReportDetailDto>> GetReportByIdAsync(Guid id);
        Task<Result<IEnumerable<ReportListDto>>> GetFilteredReportsAsync(string? status = null, string? search = null);

        // Create/Update Operations
        Task<Result<ReportDetailDto>> CreateReportAsync(CreateReportDto dto, Guid userId, string userName);
        Task<Result<ReportDetailDto>> UpdateReportStatusAsync(Guid reportId, UpdateReportStatusDto dto);
        Task<Result<ReportResponseDto>> AddResponseAsync(CreateResponseDto dto, Guid responderId, string responderName);

        // Stats Operations
        Task<Result<ReportStatsDto>> GetReportStatsAsync();

        // Legacy methods for compatibility
        Task SubmitReportAsync(ReportRequest reportRequest, Guid userId);
        Task<IEnumerable<Report>> ListReportsAsync(Guid userId, bool isAdmin);
        Task UpdateReportStatusAsync(Guid reportId, ReportStatusRequest statusRequest);
    }
}

