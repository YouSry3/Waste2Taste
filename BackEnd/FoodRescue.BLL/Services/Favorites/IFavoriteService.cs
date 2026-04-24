using FoodRescue.BLL.Contract.Products;
using FoodRescue.BLL.ResultPattern;

namespace FoodRescue.BLL.Services.Favorites;

public interface IFavoriteService
{
    Task<Result<string>> ToggleFavoriteAsync(Guid userId, Guid productId);
    Task<Result<IEnumerable<ProductListResponse>>> GetUserFavoritesAsync(Guid userId);
}
