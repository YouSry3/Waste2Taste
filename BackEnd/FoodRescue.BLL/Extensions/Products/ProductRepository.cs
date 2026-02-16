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

    public async Task<IEnumerable<Product>> GetAllAsync( Guid? vendorId, bool? expired)
    {
        var query = _context.Products.AsQueryable();

        if (vendorId.HasValue)
            query = query.Where(x => x.VendorId == vendorId);

        if (expired.HasValue)
            query = query.Where(x => x.Expired == expired);

        return await query.AsNoTracking().ToListAsync();
    }

    public async Task<Product?> GetByIdAsync(Guid id)
    {
        return await _context.Products
            .Include(p => p.Vendor)
            .FirstOrDefaultAsync(p => p.Id == id);
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

    public async Task<bool> VendorExistsAsync(Guid vendorId)
    {
        return await _context.Vendors.AnyAsync(v => v.Id == vendorId);
    }
}
