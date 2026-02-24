using FoodRescue.BLL.Contract.AdminDashbord.Moderation;
using FoodRescue.BLL.Extensions.Products;
using FoodRescue.BLL.Extensions.Vendors;
using FoodRescue.BLL.Services.Reports;
using FoodRescue.DAL.Consts;
using Microsoft.Extensions.Logging;

namespace FoodRescue.BLL.ServicesWeb.Admin.Moderation;

public class ModerationService : IModerationService
{
    private readonly IProductRepository _productRepository;
    private readonly IVendorRepository _vendorRepository;
    private readonly IReportsService _reportsService;
    private readonly ILogger<ModerationService> _logger;

    public ModerationService(
        IProductRepository productRepository,
        IVendorRepository vendorRepository,
        IReportsService reportsService,
        ILogger<ModerationService> logger)
    {
        _productRepository = productRepository ?? throw new ArgumentNullException(nameof(productRepository));
        _vendorRepository = vendorRepository ?? throw new ArgumentNullException(nameof(vendorRepository));
        _reportsService = reportsService ?? throw new ArgumentNullException(nameof(reportsService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ModerationSummaryDto> GetModerationSummaryAsync()
    {
        _logger.LogInformation("Retrieving moderation summary at {Timestamp}", DateTime.UtcNow);

        var listingsToReviewCount = await GetListingsToReviewCountAsync();
        var flaggedListingsCount = await GetFlaggedListingsCountAsync();
        var pendingVendorRequestsCount = await GetPendingVendorRequestsCountAsync();
        var openReportsCount = await GetOpenCustomerReportsCountAsync();

        var summary = new ModerationSummaryDto
        {
            ListingsToReviewCount = listingsToReviewCount,
            FlaggedListingsCount = flaggedListingsCount,
            PendingVendorRequestsCount = pendingVendorRequestsCount,
            OpenCustomerReportsCount = openReportsCount,
            GeneratedAt = DateTime.UtcNow
        };

        _logger.LogInformation(
            "Moderation summary retrieved. Total items: {TotalItems}",
            summary.TotalItemsForModeration);

        return summary;
    }

    public async Task<int> GetListingsToReviewCountAsync()
    {
        var allProducts = await _productRepository.GetActiveAsync(null);

        return allProducts
            .Count(p => p.Status == ProductStatus.Pending);
    }

    public async Task<int> GetFlaggedListingsCountAsync()
    {
        var allProducts = await _productRepository.GetActiveAsync(null);

        return allProducts
            .Count(p => p.AISpoileRequest != null && p.AISpoileRequest.IsSpoiled);
    }

    public async Task<int> GetPendingVendorRequestsCountAsync()
    {
        var vendors = await _vendorRepository.GetVendorsAsync(null, "Pending");

        return vendors?.Count ?? 0;
    }

    public async Task<int> GetOpenCustomerReportsCountAsync()
    {
        var allReports = await _reportsService.ListReportsAsync(Guid.Empty, isAdmin: true);

        return allReports
            .Count(r => r.Status == "Open");
    }
}