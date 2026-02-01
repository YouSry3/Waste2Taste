
using FoodRescue.BLL.Contract.Reviews;
using FoodRescue.DAL.Entities;

namespace FoodRescue.BLL.Services.Reviews
{
    public interface IReviewService
    {
        Task<IEnumerable<Review>> GetReviewsByProductId(Guid productId);
        Task AddReviewAsync(Guid userId, ReviewRequest request);
        Task DeleteReviewAsync(int reviewId, Guid userId);
    }
}
