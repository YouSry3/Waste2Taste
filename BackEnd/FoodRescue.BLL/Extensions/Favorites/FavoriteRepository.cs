using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace FoodRescue.BLL.Extensions.Favorites;

public class FavoriteRepository : IFavoriteRepository
{
    private readonly CompanyDbContext _context;

    public FavoriteRepository(CompanyDbContext context)
    {
        _context = context;
    }

    public async Task<Favorite?> GetByUserAndProductAsync(Guid userId, Guid productId)
    {
        return await _context.Favorites
            .AsNoTracking()
            .FirstOrDefaultAsync(f => f.UserId == userId && f.ProductId == productId);
    }

    public async Task<bool> ExistsAsync(Guid userId, Guid productId)
    {
        return await _context.Favorites
            .AnyAsync(f => f.UserId == userId && f.ProductId == productId);
    }

    public async Task<IEnumerable<Guid>> GetFavoriteProductIdsByUserAsync(Guid userId)
    {
        return await _context.Favorites
            .Where(f => f.UserId == userId)
            .Select(f => f.ProductId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetUserFavoritesAsync(Guid userId)
    {
        return await _context.Favorites
            .Where(f => f.UserId == userId)
            .Include(f => f.Product)
            .ThenInclude(p => p.Vendor)
            .Include(f => f.Product)
            .ThenInclude(p => p.Reviews)
            .Select(f => f.Product)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task AddAsync(Favorite favorite)
    {
        await _context.Favorites.AddAsync(favorite);
    }

    public async Task RemoveAsync(Favorite favorite)
    {
        _context.Favorites.Remove(favorite);
        await Task.CompletedTask;
    }

    public async Task<bool> SaveChangesAsync()
    {
        try
        {
            await _context.SaveChangesAsync();
            return true;
        }
        catch
        {
            return false;
        }
    }
}
