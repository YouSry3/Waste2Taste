using Azure.Core;
using FoodRescue.BLL.Contract.Reviews;
using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using Microsoft.EntityFrameworkCore;
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
        public async Task<IEnumerable<Review>> GetReviewsByProductId(Guid productId)
        {
            return await _context.Reviews
                .Where(r => r.ProductId == productId)
                .Include(r => r.User)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task AddReviewAsync(Guid userId, ReviewRequest request)
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
        }

        public async Task DeleteReviewAsync(int reviewId, Guid userId)
        {
            var review = await _context.Reviews
             .FirstOrDefaultAsync(r => r.Id == reviewId && r.UserId == userId);

            if (review == null)
                throw new Exception("Review not found or not authorized");

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
        }
    }
}
