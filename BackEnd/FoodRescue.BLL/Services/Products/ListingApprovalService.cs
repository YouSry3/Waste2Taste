using FoodRescue.BLL.Contract.Listings;
using FoodRescue.BLL.Contract.Logs;
using FoodRescue.BLL.ResultPattern;
using FoodRescue.BLL.ResultPattern.TypeErrors;
using FoodRescue.BLL.Services.Logs;
using FoodRescue.DAL.Consts;
using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FoodRescue.BLL.Services.Products;

public class ListingApprovalService : IListingApprovalService
{
    private readonly CompanyDbContext _context;
    private readonly ILogger<ListingApprovalService> _logger;
    private readonly IActivityLogService _activityLogService;

    public ListingApprovalService(CompanyDbContext context
        , ILogger<ListingApprovalService> logger
        , IActivityLogService activityLogService)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _activityLogService = activityLogService ?? throw new ArgumentNullException(nameof(activityLogService));
    }

    public async Task<Result> ApproveListingAsync(Guid productId, Guid userId)
    {
        try
        {
            var product = await _context.Products.FindAsync(productId);

            if (product == null)
            {
                _logger.LogWarning("Product not found for approval: {ProductId}", productId);
                return Result.Failure(ProductErrors.NotFound);
            }

            if (product.Status != ProductStatus.Pending)
            {
                _logger.LogWarning("Product {ProductId} is not in pending status for approval", productId);
                return Result.Failure(ProductErrors.UnvalidStatus);
            }

            product.Status = ProductStatus.Approved;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Product {ProductId} approved successfully", productId);
            await _activityLogService.WriteAsync(new CreateActivityLogDto
            {
                Module = "VendorRequests",
                Action = "Approved",
                EntityType = "Product",
                EntityId = productId,
                EntityName = product.Name,
                Description = $"Approved product listing for {product.Name}",
                OldValue = "pending",
                NewValue = "approved"
            }, userId, "Admin");
            return Result.Success();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error approving product {ProductId}", productId);
            return Result.Failure(new Error("Listing.ApprovalError", "An error occurred while approving the listing"));
        }
    }

    public async Task<Result> RejectListingAsync(Guid productId, string rejectionReason, Guid userId)
    {
        try
        {
            var product = await _context.Products.FindAsync(productId);

            if (product == null)
            {
                _logger.LogWarning("Product not found for rejection: {ProductId}", productId);
                return Result.Failure(ProductErrors.NotFound);
            }

            if (product.Status != ProductStatus.Pending)
            {
                _logger.LogWarning("Product {ProductId} is not in pending status for rejection", productId);
                return Result.Failure(ProductErrors.UnvalidStatus);
            }

            product.Status = ProductStatus.Discontinued;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Product {ProductId} rejected with reason: {RejectionReason}", productId, rejectionReason);
            await _activityLogService.WriteAsync(new CreateActivityLogDto
            {
                Module = "VendorRequests",
                Action = "Rejected",
                EntityType = "Product",
                EntityId = productId,
                EntityName = product.Name,
                Description = $"Rejected product listing for {product.Name}",
                OldValue = "pending",
                NewValue = "discontinued"
            }, userId, "Admin");
            return Result.Success();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error rejecting product {ProductId}", productId);
            return Result.Failure(new Error("Listing.RejectionError", "An error occurred while rejecting the listing"));
        }
    }

    public async Task<Result<Product>> GetPendingListingAsync(Guid productId)
    {
        try
        {
            var product = await _context.Products
                .Where(p => p.Id == productId && p.Status == ProductStatus.Pending)
                .FirstOrDefaultAsync();

            if (product == null)
            {
                _logger.LogWarning("Pending product not found: {ProductId}", productId);
                return Result.Failure<Product>(ProductErrors.NotFound);
            }

            return Result.Success(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving pending product {ProductId}", productId);
            return Result.Failure<Product>(new Error("Listing.RetrievalError", "An error occurred while retrieving the pending listing"));
        }
    }

    public async Task<Result<IEnumerable<ListingsPindingResponse>>> GetAllPendingListingsAsync()
    {
        try
        {
            var products = await _context.Products
                .Where(p => p.Status == ProductStatus.Pending)
                .Include(p => p.AISpoileRequest)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            var pendingProducts = products.Adapt<List<ListingsPindingResponse>>();

            return Result.Success<IEnumerable<ListingsPindingResponse>>(pendingProducts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all pending products");

            return Result.Failure<IEnumerable<ListingsPindingResponse>>(
                new Error("Listing.RetrievalError",
                "An error occurred while retrieving pending listings"));
        }
    }

}

