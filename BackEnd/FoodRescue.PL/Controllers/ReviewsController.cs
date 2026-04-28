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

        [HttpGet("vendor/GetReviewsWithSentiment")]
        [ProducesResponseType(typeof(List<ReviewWithSentimentResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [Authorize(Roles = "vendor")]
        [Produces("application/json")]
        public async Task<IActionResult> GetReviewsWithSentiment([FromHeader]Guid vendorId)
        {
            var result = await _reviewService.GetReviewsWithSentiment(vendorId);

            return result.IsSuccess? 
                Ok(result.Value):
                NotFound(result.Error);
        }

  
        // Add review
        [HttpPost("Add")]
        [Authorize(Roles = "customer")]
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
