using FoodRescue.BLL.Contract.Reviews;
using FoodRescue.BLL.Services.Reviews;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodRescue.PL.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class ReviewsController(IReviewService reviewService) : ControllerBase
    {
        private readonly IReviewService _reviewService = reviewService;

        // Get all reviews for product
        [HttpGet("product")]
        public async Task<IActionResult> GetReviews([FromHeader]Guid productId)
        {
            var reviews = await _reviewService.GetReviewsByProductId(productId);

            var result = reviews.Select(r => new ReviewResponse
            {
                Id = r.Id,
                Rating = r.Rating,
                Comment = r.Comment,
                UserName = r.User.Name,
                CreatedAt = r.CreatedAt
            });

            return Ok(result);
        }
        // Add review
        [HttpPost("Add")]
        public async Task<IActionResult> AddReview([FromBody]ReviewRequest request)
        {
            // temporary (later JWT)
            Guid userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier).Value
            ); 

            await _reviewService.AddReviewAsync(userId, request);

            return Ok(new { message = "Review added successfully" });
        }

        // Delete review
        [HttpDelete("{reviewId}")]
        public async Task<IActionResult> DeleteReview([FromRoute]int reviewId)
        {
            Guid userId = Guid.Parse(User.FindFirstValue
                (ClaimTypes.NameIdentifier));

            await _reviewService.DeleteReviewAsync(reviewId, userId);

            return NoContent();
        }

    }
}
