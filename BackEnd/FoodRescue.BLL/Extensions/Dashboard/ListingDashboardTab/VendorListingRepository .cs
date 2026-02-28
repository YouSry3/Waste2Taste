using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using FoodRescue.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodRescue.BLL.Extensions.Dashboard.ListingDashboardTab;

public class VendorListingRepository : IVendorListingRepository
{
    private readonly CompanyDbContext _context;

    public VendorListingRepository(CompanyDbContext context)
    {
        _context = context;
    }

    public async Task<List<Product>> GetVendorListingsAsync(Guid vendorId, ListingFilter filter)
    {
        var query = _context.Products
            .AsNoTracking()
            .Include(p => p.Vendor)
            .Include(p => p.Reviews)
            .Where(p => p.VendorId == vendorId);

        // Search filter
        if (!string.IsNullOrEmpty(filter.SearchTerm))
        {
            query = query.Where(p =>
                p.Name.Contains(filter.SearchTerm) ||
                p.Description.Contains(filter.SearchTerm));
        }

        // Category filter
        if (!string.IsNullOrEmpty(filter.Category) && filter.Category != "All Categories")
        {
            query = query.Where(p => p.Category == filter.Category);
        }

        // Status filter
        if (!string.IsNullOrEmpty(filter.Status) && filter.Status != "All Status")
        {
            query = filter.Status switch
            {
                "Active" => query.Where(p => !p.Expired && p.Quantity > 0),
                "Sold Out" => query.Where(p => p.Expired || p.Quantity == 0),
                _ => query
            };
        }

        return await query.OrderByDescending(p => p.CreatedAt).ToListAsync();
    }

    public async Task<Product?> GetListingByIdAsync(Guid productId, Guid vendorId)
    {
        return await _context.Products
            .AsNoTracking()
            .Include(p => p.Vendor)
            .Include(p => p.Reviews)
            .FirstOrDefaultAsync(p => p.Id == productId && p.VendorId == vendorId);
    }

    public async Task<bool> UpdateListingAsync(Product product)
    {
        _context.Products.Update(product);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteListingAsync(Guid productId, Guid vendorId)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == productId && p.VendorId == vendorId);

        if (product == null) return false;

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<int> GetActiveListingsCountAsync(Guid vendorId)
    {
        return await _context.Products
            .AsNoTracking()
            .CountAsync(p => p.VendorId == vendorId && !p.Expired && p.Quantity > 0);
    }
}