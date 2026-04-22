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

        /// <summary>
        /// Get all reviews for a specific product
        /// </summary>
        /// <remarks>
        /// Returns a list of all reviews for the specified product including user information,
        /// ratings, comments, and user profile images.
        /// </remarks>
        /// <param name="productId">The product ID to retrieve reviews for</param>
        /// <returns>List of reviews with user profile images</returns>
        /// <response code="200">Reviews retrieved successfully with user image information</response>
        /// <response code="404">Product not found or no reviews exist</response>
        [HttpGet("product")]
        [ProducesResponseType(typeof(List<ReviewResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [Produces("application/json")]
        public async Task<IActionResult> GetReviews([FromHeader]Guid productId)
        {
            var result = await _reviewService.GetReviewsByProductId(productId);



            return result.IsSuccess? 
                Ok(result.Value):
                NotFound(result.Error);
        }
        // Add review
        [HttpPost("Add")]
        public async Task<IActionResult> AddReview([FromBody]ReviewRequest request)
        {
            // temporary (later JWT)
            Guid userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            ); 

            var result = await _reviewService.AddReviewAsync(userId, request);

            return result.IsSuccess?
                Ok(new { message = "Review added successfully" })
                :NotFound(result.Error);
        }

        // Delete review
        [HttpDelete("{reviewId}")]
        public async Task<IActionResult> DeleteReview([FromRoute]int reviewId)
        {
            Guid userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var result = await _reviewService.DeleteReviewAsync(reviewId, userId);

            return result.IsSuccess?
                NoContent()
               :NotFound(result.Error);
                
        }

    }
}
