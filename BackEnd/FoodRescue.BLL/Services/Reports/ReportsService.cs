using FoodRescue.BLL.Contract.Reports.Create;
using FoodRescue.BLL.Contract.Reports.Update;
using FoodRescue.BLL.Contract.Reports.Get;
using FoodRescue.BLL.Contract.Reports.Response;
using FoodRescue.BLL.Contract.Reports.Stats;
using FoodRescue.BLL.Extensions.Reports;
using FoodRescue.BLL.ResultPattern;
using FoodRescue.BLL.ResultPattern.TypeErrors;
using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using FoodRescue.DAL.Consts;
using Microsoft.EntityFrameworkCore;

namespace FoodRescue.BLL.Services.Reports
{
    public class ReportsService(CompanyDbContext context, 
                                IReportRepository reportRepository,
                                IProductRepository productRepository) : IReportsService
    {
        private readonly CompanyDbContext _context = context;
        private readonly IReportRepository _reportRepository = reportRepository;
        private readonly IProductRepository _productRepository = productRepository;
        
        // Get Operations
        public async Task<Result<IEnumerable<ReportListDto>>> GetAllReportsAsync()
        {
            var reports = await _reportRepository.GetAllAsync();
            var dtos = reports.Select(MapToListDto).ToList();
            return Result.Success<IEnumerable<ReportListDto>>(dtos);
        }

        public async Task<Result<IEnumerable<ReportListDto>>> GetReportsByUserAsync(Guid userId)
        {
            var reports = await _reportRepository.GetByUserIdAsync(userId);
            var dtos = reports.Select(MapToListDto).ToList();
            return Result.Success<IEnumerable<ReportListDto>>(dtos);
        }

        public async Task<Result<ReportDetailDto>> GetReportByIdAsync(Guid id)
        {
            var report = await _reportRepository.GetByIdAsync(id);
            if (report == null)
                return Result.Failure<ReportDetailDto>(new Error("NOT_FOUND", "Report not found"));

            var dto = MapToDetailDto(report);
            return Result.Success(dto);
        }

        public async Task<Result<IEnumerable<ReportListDto>>> GetFilteredReportsAsync(string? status = null, string? search = null)
        {
            var reports = await _reportRepository.GetFilteredAsync(status, null, search);
            var dtos = reports.Select(MapToListDto).ToList();
            return Result.Success<IEnumerable<ReportListDto>>(dtos);
        }

        // Create/Update Operations
        public async Task<Result<ReportDetailDto>> CreateReportAsync(CreateReportDto dto, Guid userId, string userName)
        {
            // Validate required fields
            if (string.IsNullOrEmpty(dto.IssueType) || string.IsNullOrEmpty(dto.Description))
                return Result.Failure<ReportDetailDto>(new Error("INVALID_DATA", "Issue type and description are required"));

            var productExists = await _productRepository.ExistsAsync(dto.ProductId);

            if (!productExists)
                return Result.Failure<ReportDetailDto>(
                    new Error("INVALID_PRODUCT", "Product does not exist"));
            // Generate report code
            var reportCode = await _reportRepository.GenerateReportCodeAsync();

            var report = new Report
            {
                Id = Guid.NewGuid(),
                ReportCode = reportCode,
                CustomerName = userName,
                UserId = userId,
                OrderId = dto.OrderId,
                ProductId = dto.ProductId,
                ListingName = dto.ListingName,
                IssueType = dto.IssueType,
                Description = dto.Description,
                Status = "Pending",
                Priority = Enum.TryParse<ReportPriority>(dto.Priority, out var priority) ? priority : ReportPriority.Medium,
                RefundAmount = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = null
            };

            await _reportRepository.AddAsync(report);
            var detailDto = MapToDetailDto(report);
            return Result.Success(detailDto);
        }

        public async Task<Result<ReportDetailDto>> UpdateReportStatusAsync(Guid reportId, UpdateReportStatusDto dto)
        {
            var report = await _reportRepository.GetByIdAsync(reportId);
            if (report == null)
                return Result.Failure<ReportDetailDto>(new Error("NOT_FOUND", "Report not found"));

            // Validate status
            var validStatuses = new[] { "Pending", "InReview", "Resolved" };
            if (!validStatuses.Contains(dto.Status))
                return Result.Failure<ReportDetailDto>(new Error("INVALID_STATUS", "Invalid status"));

            report.Status = dto.Status;
            if (dto.RefundAmount.HasValue)
                report.RefundAmount = dto.RefundAmount.Value;

            await _reportRepository.UpdateAsync(report);
            var detailDto = MapToDetailDto(report);
            return Result.Success(detailDto);
        }

        public async Task<Result<ReportResponseDto>> AddResponseAsync(CreateResponseDto dto, Guid responderId, string responderName)
        {
            var report = await _reportRepository.GetByIdAsync(dto.ReportId);
            if (report == null)
                return Result.Failure<ReportResponseDto>(new Error("NOT_FOUND", "Report not found"));

            var response = new ReportResponse
            {
                Id = Guid.NewGuid(),
                ReportId = dto.ReportId,
                ResponderId = responderId,
                Message = dto.Message,
                Attachment = dto.AttachmentUrl,
                CreatedAt = DateTime.UtcNow
            };

            await _reportRepository.AddResponseAsync(response);

            var responseDto = new ReportResponseDto
            {
                Id = response.Id,
                ReportId = response.ReportId,
                ResponderName = responderName,
                Message = response.Message,
                Attachment = response.Attachment,
                CreatedAt = response.CreatedAt
            };

            return Result.Success(responseDto);
        }

        // Stats Operations
        public async Task<Result<ReportStatsDto>> GetReportStatsAsync()
        {
            var total = await _reportRepository.GetTotalReportsAsync();
            var pending = await _reportRepository.GetReportCountByStatusAsync("Pending");
            var inReview = await _reportRepository.GetReportCountByStatusAsync("InReview");
            var resolved = await _reportRepository.GetReportCountByStatusAsync("Resolved");
            var highPriority = await _reportRepository.GetReportCountByPriorityAsync("High");
            var totalRefund = await _reportRepository.GetTotalRefundAmountAsync();

            var allReports = await _reportRepository.GetAllAsync();

            var stats = new ReportStatsDto
            {
                TotalReports = total,
                PendingReports = pending,
                InReviewReports = inReview,
                ResolvedReports = resolved,
                HighPriorityReports = highPriority,
                TotalRefundAmount = totalRefund,
                AverageResolutionTime = CalculateAverageResolutionTime(allReports),
                ReportsByType = allReports
                    .GroupBy(r => r.IssueType)
                    .ToDictionary(g => g.Key, g => g.Count()),
                ReportsByPriority = allReports
                    .GroupBy(r => r.Priority.ToString())
                    .ToDictionary(g => g.Key, g => g.Count())
            };

            return Result.Success(stats);
        }

        // Legacy methods for compatibility
        public async Task SubmitReportAsync(ReportRequest reportRequest, Guid userId)
        {
            var report = new Report
            {
                UserId = userId,
                ProductId = reportRequest.ProductId,
                IssueType = reportRequest.Type,
                Description = reportRequest.Description,
                Status = "Pending",
                Priority = ReportPriority.Medium,
                CreatedAt = DateTime.UtcNow,
                ReportCode = await _reportRepository.GenerateReportCodeAsync()
            };

            await _reportRepository.AddAsync(report);
        }

        public async Task<IEnumerable<Report>> ListReportsAsync(Guid userId, bool isAdmin)
        {
            if (isAdmin)
            {
                return await _reportRepository.GetAllAsync();
            }
            else
            {
                return await _reportRepository.GetByUserIdAsync(userId);
            }
        }

        public async Task UpdateReportStatusAsync(Guid reportId, ReportStatusRequest statusRequest)
        {
            var report = await _reportRepository.GetByIdAsync(reportId);
            if (report == null)
                throw new KeyNotFoundException("Report not found");

            report.Status = statusRequest.NewStatus;
            await _reportRepository.UpdateAsync(report);
        }

        // Helper Methods
        private ReportListDto MapToListDto(Report report)
        {
            return new ReportListDto
            {
                Id = report.Id,
                ReportCode = report.ReportCode,
                CustomerName = report.CustomerName,
                ListingName = report.ListingName,
                IssueType = report.IssueType,
                Status = report.Status,
                Priority = report.Priority.ToString(),
                CreatedAt = report.CreatedAt,
                ResponseCount = report.Responses?.Count ?? 0
            };
        }

        private ReportDetailDto MapToDetailDto(Report report)
        {
            return new ReportDetailDto
            {
                Id = report.Id,
                ReportCode = report.ReportCode,
                CustomerName = report.CustomerName,
                OrderId = report.OrderId,
                ListingName = report.ListingName,
                IssueType = report.IssueType,
                Description = report.Description,
                Status = report.Status,
                Priority = report.Priority.ToString(),
                RefundAmount = report.RefundAmount,
                CreatedAt = report.CreatedAt,
                UpdatedAt = report.UpdatedAt,
                Responses = report.Responses?.Select(rr => new ReportResponseDto
                {
                    Id = rr.Id,
                    ReportId = rr.ReportId,
                    ResponderName = rr.Responder?.Name ?? "Unknown",
                    Message = rr.Message,
                    Attachment = rr.Attachment,
                    CreatedAt = rr.CreatedAt
                }).ToList() ?? new List<ReportResponseDto>()
            };
        }

        private double CalculateAverageResolutionTime(IEnumerable<Report> reports)
        {
            var resolvedReports = reports.Where(r => r.Status == "Resolved" && r.UpdatedAt.HasValue).ToList();
            if (resolvedReports.Count == 0)
                return 0;

            var totalHours = resolvedReports.Sum(r => (r.UpdatedAt!.Value - r.CreatedAt).TotalHours);
            return totalHours / resolvedReports.Count;
        }
    }
}

