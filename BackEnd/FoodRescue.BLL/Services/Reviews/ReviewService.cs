using Azure.Core;
using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Abstractions.TypeErrors;
using FoodRescue.BLL.Contract.Reviews;
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
    public class ReviewService(CompanyDbContext context) : IReviewService
    {
        private readonly CompanyDbContext _context = context;

        // 1️⃣ Get all reviews for one product
        public async Task<Result<List<ReviewResponse>>> GetReviewsByProductId(Guid productId)
        {
            
            var reviews = await _context.Reviews
                .Where(r => r.ProductId == productId)
                .Include(r => r.User)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => r.Adapt<ReviewResponse>())
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

            return Result.Success();
        }

        public async Task<Result> DeleteReviewAsync(int reviewId, Guid userId)
        {
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
