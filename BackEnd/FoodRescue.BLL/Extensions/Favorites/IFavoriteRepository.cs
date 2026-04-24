using FoodRescue.DAL.Entities;

namespace FoodRescue.BLL.Extensions.Favorites;

public interface IFavoriteRepository
{
    Task<Favorite?> GetByUserAndProductAsync(Guid userId, Guid productId);
    Task<bool> ExistsAsync(Guid userId, Guid productId);
    Task<IEnumerable<Guid>> GetFavoriteProductIdsByUserAsync(Guid userId);
    Task<IEnumerable<Product>> GetUserFavoritesAsync(Guid userId);
    Task AddAsync(Favorite favorite);
    Task RemoveAsync(Favorite favorite);
    Task<bool> SaveChangesAsync();
}
