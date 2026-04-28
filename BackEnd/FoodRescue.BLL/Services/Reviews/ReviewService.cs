using Azure.Core;
using FoodRescue.BLL.ResultPattern;
using FoodRescue.BLL.ResultPattern.TypeErrors;
using FoodRescue.BLL.Contract.Reviews;
using FoodRescue.BLL.Extensions.Users;
using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using Mapster;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Services.Reviews
{
    public class ReviewService(CompanyDbContext context,
        IUserRepository userRepository,
        ISentimentService sentimentService) : IReviewService
    {
        private readonly CompanyDbContext _context = context;
        private readonly IUserRepository _userRepository = userRepository;
        private readonly ISentimentService _sentimentService = sentimentService;

        public async Task<Result<List<ReviewWithSentimentResponse>>> GetReviewsWithSentiment(Guid vendorId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.Product.VendorId == vendorId)
                .Include(r => r.User)
                .Include(r => r.SentimentAnalysis)
                .Include(r => r.Product)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewWithSentimentResponse
                {
                    Id = r.Id,
                    Comment = r.Comment,
                    Rating = r.Rating,
                    CreatedAt = r.CreatedAt,

                    User = r.User.Adapt<InfoUser>(),

                    Sentiment = r.SentimentAnalysis == null
                        ? null
                        : new SentimentDto
                        {
                            Gratitude = r.SentimentAnalysis.Gratitude,
                            Excitement = r.SentimentAnalysis.Excitement,
                            Urgency = r.SentimentAnalysis.Urgency,
                            Neutral = r.SentimentAnalysis.Neutral
                        }
                })
                .ToListAsync();

            return reviews.Count == 0
                ? Result.Failure<List<ReviewWithSentimentResponse>>(ReviewErrors.ReviewsNotFound(vendorId))
                : Result.Success(reviews);
        }
        // 1️⃣ Get all reviews for one product
        public async Task<Result<List<ReviewResponse>>> GetReviewsByProductId(Guid productId)
        {

            var reviews = await _context.Reviews
                .Where(r => r.ProductId == productId)
                .Include(r => r.User)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewResponse
                {
                    Id = r.Id,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    User = r.User.Adapt<InfoUser>(),
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();


            return reviews.IsNullOrEmpty()?
                Result.Failure<List<ReviewResponse>>(ReviewErrors.ReviewsNotFound(productId)):
                Result.Success( reviews);
        }

        public async Task<Result> AddReviewAsync(Guid userId, ReviewRequest request)
        {
          
            var review = new Review
            {
                UserId = userId,
                ProductId = request.ProductId,
                Rating = request.Rating,
                Comment = request.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            // 2. Call AI
            var sentiment = await _sentimentService.AnalyzeText(request.Comment);

            // 3. Save Sentiment
            var analysis = new SentimentAnalysis
            {
                ReviewId = review.Id,
                Gratitude = sentiment.Tags.GetValueOrDefault("gratitude"),
                Excitement = sentiment.Tags.GetValueOrDefault("excitement"),
                Urgency = sentiment.Tags.GetValueOrDefault("urgency"),
                Neutral = sentiment.Neutral,
                CreatedAt = DateTime.UtcNow
            };

            _context.SentimentAnalysis.Add(analysis);
            await _context.SaveChangesAsync();


            return Result.Success();
        }

        public async Task<Result> DeleteReviewAsync(int reviewId, Guid userId)
        {
            var isCustomer = await _userRepository.IsCustomer(userId);
            if (!isCustomer)
                return Result.Failure(ReviewErrors.OnlyCustomersCanAddReviews(userId));

            var review = await _context.Reviews
             .FirstOrDefaultAsync(r => r.Id == reviewId && r.UserId == userId);

            if (review == null)
                return Result.Failure(ReviewErrors.ReviewsNotFound(userId));

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return Result.Success();
        }

        
    }
}
