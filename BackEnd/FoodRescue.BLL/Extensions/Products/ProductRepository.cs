using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace FoodRescue.BLL.Extensions.Products;

public class ProductRepository : IProductRepository
{
    private readonly CompanyDbContext _context;

    public ProductRepository(CompanyDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Product>> GetActiveAsync(string? name)
    {
        var query = _context.Products
            .AsNoTracking()
            .Include(p => p.Vendor)
            .Where(p => p.ExpiryDate > DateTime.Now
                     && p.Quantity > 0
                     && !p.Expired
                     );

        if (!string.IsNullOrEmpty(name))
            query = query.Where(p => p.Name.Contains(name));

        return await query
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetByVendorAsync(Guid vendorId)
    {
        return await _context.Products
            .AsNoTracking()
            .Include(p => p.Vendor)
            .Where(p => p.VendorId == vendorId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<Product?> GetByIdAsync(Guid id)
    {
        return await _context.Products
            .AsTracking()
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Product?> GetByIdWithVendorAndReviewsAsync(Guid id)
    {
        return await _context.Products
            .AsNoTracking()
            .Include(p => p.Vendor)
            .Include(p => p.Reviews)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Vendor?> GetVendorByIdAsync(Guid vendorId)
    {
        return await _context.Vendors
            .AsNoTracking()
            .FirstOrDefaultAsync(v => v.Id == vendorId);
    }

    public async Task AddAsync(Product product)
    {
        await _context.Products.AddAsync(product);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Product product)
    {
        _context.Products.Update(product);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Product product)
    {
        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Products
            .AsNoTracking()
            .AnyAsync(p => p.Id == id);
    }
}