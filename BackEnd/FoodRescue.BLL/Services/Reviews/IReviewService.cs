
using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Contract.Reviews;
using FoodRescue.DAL.Entities;

namespace FoodRescue.BLL.Services.Reviews
{
    public interface IReviewService
    {
        Task<Result<List<ReviewResponse>>> GetReviewsByProductId(Guid productId);
        Task<Result> AddReviewAsync(Guid userId, ReviewRequest request);
        Task<Result> DeleteReviewAsync(int reviewId, Guid userId);
    }
}
