using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace FoodRescue.BLL.Extensions.Vendors;

public class VendorRepository : IVendorRepository
{
    private readonly CompanyDbContext _context;

    public VendorRepository(CompanyDbContext context)
    {
        _context = context;
    }

    public async Task<List<Vendor>> GetVendorsAsync(string? name, string? status)
    {
        var query = _context.Vendors.AsQueryable();

        if (!string.IsNullOrWhiteSpace(name))
            query = query.Where(v => v.Name.Contains(name));

        

        return await query.OrderBy(v => v.Name).ToListAsync();
    }

    public async Task<Vendor?> GetVendorByIdAsync(Guid id)
    {
        return await _context.Vendors.FirstOrDefaultAsync(v => v.Id == id);
    }

    public async Task<Vendor?> GetByIdAsync(Guid id)
    {
        return await _context.Vendors
       .FirstOrDefaultAsync(v => v.Id == id);
    }

    public async Task<Vendor?> GetVendorWithProductsAsync(Guid id)
    {
        return await _context.Vendors
            .Include(v => v.Products)
            .FirstOrDefaultAsync(v => v.Id == id);
    }

    public async Task AddAsync(Vendor vendor)
    {
        _context.Vendors.Add(vendor);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Vendor vendor)
    {
        _context.Vendors.Update(vendor);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Vendor vendor)
    {
        _context.Vendors.Remove(vendor);
        await _context.SaveChangesAsync();
    }
}
