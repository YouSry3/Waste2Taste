using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Contract.AdminDashbord.Dashboard.Response;
using FoodRescue.BLL.Extensions.Dashboard;
using FoodRescue.DAL.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FoodRescue.BLL.ServicesWeb.Admin
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly CompanyDbContext _context;

        public DashboardRepository(CompanyDbContext context)
        {
            _context = context;
        }

        public async Task<Result<decimal>> GetTotalRevenueAsync(int days)
        {
            var fromDate = DateTime.UtcNow.AddDays(-days);
            var totalRevenue = await _context.Orders
                .Where(o => o.CreatedAt >= fromDate)
                .SumAsync(o => (decimal?)o.TotalPrice) ?? 0;
            return Result.Success(totalRevenue);
        }

        public async Task<Result<int>> GetOrdersCountAsync(int days)
        {
            var fromDate = DateTime.UtcNow.AddDays(-days);
            var count = await _context.Orders
                .CountAsync(o => o.CreatedAt >= fromDate);
            return Result.Success(count);
        }

        public async Task<Result<int>> GetActiveUsersCountAsync(int days)
        {
            var count = await _context.Users.CountAsync();
            return Result.Success(count);
        }

        public async Task<Result<int>> GetVendorsCountAsync(int days)
        {
            var count = await _context.Vendors.CountAsync();
            return Result.Success(count);
        }

        public async Task<List<MonthlyTrendDto>> GetMonthlyTrendsAsync(int days)
        {
            return await _context.Orders
                .GroupBy(o => new { o.CreatedAt.Year, o.CreatedAt.Month })
                .Select(g => new MonthlyTrendDto
                {
                    Month = g.Key.Month.ToString(),
                    Revenue = g.Sum(o => o.TotalPrice),
                    Orders = g.Count()
                })
                .OrderBy(x => x.Month)
                .ToListAsync();
        }

        public async Task<List<CategoryDistributionDto>> GetCategoryDistributionAsync()
        {
            var categoryData = await _context.Products
                .GroupBy(p => p.Category)
                .Select(g => new
                {
                    Category = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            var totalProducts = categoryData.Sum(x => x.Count);

            return categoryData
                .Select(c => new CategoryDistributionDto
                {
                    CategoryName = c.Category,
                    Count = c.Count,
                    Percentage = totalProducts == 0 ? 0 :
                                 (decimal)c.Count / totalProducts * 100
                })
                .ToList();
        }
    }
}

