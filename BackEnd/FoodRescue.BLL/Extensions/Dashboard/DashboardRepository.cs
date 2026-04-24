using FoodRescue.BLL.ResultPattern;
using FoodRescue.BLL.Contract.AdminDashbord.Dashboard.Response;
using FoodRescue.BLL.Contract.AdminDashbord.Users;
using FoodRescue.BLL.Contract.AdminDashbord.Users.Response;
using FoodRescue.BLL.Contract.AdminDashbord.Vendors.Response;
using FoodRescue.DAL.Context;
using FoodRescue.DAL.Extensions.Dashboard;
using Microsoft.EntityFrameworkCore;

namespace FoodRescue.BLL.Repositorys.Dashboard
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly CompanyDbContext _context;

        public DashboardRepository(CompanyDbContext context)
        {
            _context = context;
        }

        // ==============================
        // Revenue
        // ==============================
        public async Task<Result<decimal>> GetTotalRevenueAsync(int days, int skipDays = 0)
        {
            var startDate = DateTime.UtcNow.AddDays(-(days + skipDays));
            var endDate = DateTime.UtcNow.AddDays(-skipDays);

            var totalRevenue = await _context.Orders
                .Where(o => o.CreatedAt >= startDate && o.CreatedAt < endDate)
                .SumAsync(o => (decimal?)o.TotalPrice) ?? 0;

            return Result.Success(totalRevenue);
        }

        // ==============================
        // Orders Count
        // ==============================
        public async Task<Result<int>> GetOrdersCountAsync(int days, int skipDays = 0)
        {
            var startDate = DateTime.UtcNow.AddDays(-(days + skipDays));
            var endDate = DateTime.UtcNow.AddDays(-skipDays);

            var count = await _context.Orders
                .CountAsync(o => o.CreatedAt >= startDate && o.CreatedAt < endDate);

            return Result.Success(count);
        }

        // ==============================
        // Active Users
        // ==============================
        public async Task<Result<int>> GetActiveUsersCountAsync(int days, int skipDays = 0)
        {
            var startDate = DateTime.UtcNow.AddDays(-(days + skipDays));
            var endDate = DateTime.UtcNow.AddDays(-skipDays);

            var count = await _context.Users
                .Where(u => u.IsActive && u.CreatedAt >= startDate && u.CreatedAt < endDate)
                .CountAsync();

            return Result.Success(count);
        }

        // ==============================
        // Vendors Count
        // ==============================
        public async Task<Result<int>> GetVendorsCountAsync(int days, int skipDays = 0)
        {
            var startDate = DateTime.UtcNow.AddDays(-(days + skipDays));
            var endDate = DateTime.UtcNow.AddDays(-skipDays);

            var count = await _context.Vendors
                .Where(v => v.CreatedAt >= startDate && v.CreatedAt < endDate)
                .CountAsync();

            return Result.Success(count);
        }

        // ==============================
        // Monthly Trends
        // ==============================
        public async Task<List<MonthlyTrendDto>> GetMonthlyTrendsAsync(int days)
        {
            var fromDate = DateTime.UtcNow.AddDays(-days);

            return await _context.Orders
                .Where(o => o.CreatedAt >= fromDate)
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

        // ==============================
        // Category Distribution
        // ==============================
        public async Task<List<CategoryDistributionDto>> GetCategoryDistributionAsync()
        {
            var categoryData = await _context.Products
                .GroupBy(p => p.Vendor.Category)
                .Select(g => new
                {
                    Category = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            var totalProducts = categoryData.Sum(x => x.Count);

            return categoryData.Select(c => new CategoryDistributionDto
            {
                CategoryName = c.Category.ToString(),
                Count = c.Count,
                Percentage = totalProducts == 0 ? 0 :
                    (decimal)c.Count / totalProducts * 100
            }).ToList();
        }

        // ==============================
        // Vendors Overview
        // ==============================
        public async Task<int> GetTotalVendorsAsync()
            => await _context.Vendors.CountAsync();

        public async Task<int> GetNgoPartnersAsync()
            => await _context.Vendors.CountAsync(v => v.Role == "NGO");

        public async Task<int> GetActiveListingsAsync()
            => await _context.Products.CountAsync(p => !p.Expired);

        public async Task<decimal> GetTotalRevenueAsync()
            => await _context.Orders
                .Where(o => o.Status == "Completed")
                .SumAsync(o => o.TotalPrice);

        // ==============================
        // Top Vendors
        // ==============================
        public async Task<List<TopVendorDto>> GetTopPerformersAsync(int count)
        {
            return await _context.Orders
                .Where(o => o.Status == "Completed")
                .GroupBy(o => o.Product.Vendor)
                .Select(g => new TopVendorDto
                {
                    Id = g.Key.Id,
                    Name = g.Key.Name,
                    Revenue = g.Sum(o => o.TotalPrice)
                })
                .OrderByDescending(x => x.Revenue)
                .Take(count)
                .ToListAsync();
        }

        // ==============================
        // Vendors List
        // ==============================
        public async Task<PagedResultDto<VendorListItemDto>> GetVendorsAsync(
            int page,
            int limit,
            string search,
            string sortBy,
            string order)
        {
            var query = _context.Vendors.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(v => v.Name.Contains(search));

            var total = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(v => new VendorListItemDto
                {
                    Id = v.Id,
                    Name = v.Name,
                    Revenue = _context.Orders
                        .Where(o => o.Product.VendorId == v.Id)
                        .Sum(o => (decimal?)o.TotalPrice) ?? 0,
                    ListingsCount = _context.Products.Count(p => p.VendorId == v.Id),
                    Rating = _context.Reviews
                        .Where(r => r.Product.VendorId == v.Id)
                        .Average(r => (double?)r.Rating) ?? 0
                })
                .ToListAsync();

            return new PagedResultDto<VendorListItemDto>
            {
                Items = items,
                TotalCount = total
            };
        }

        // ==============================
        // Users Overview
        // ==============================
        public async Task<int> GetTotalUsersAsync()
            => await _context.Users.CountAsync();

        public async Task<int> GetActiveUsersAsync()
            => await _context.Users.CountAsync(u => u.IsActive);

        public async Task<int> GetTotalOrdersAsync()
            => await _context.Orders.CountAsync();

        // ==============================
        // Top Spenders
        // ==============================
        public async Task<List<UserSummaryDto>> GetTopSpendersAsync(int top)
        {
            var users = await _context.Users
                .Select(u => new UserSummaryDto
                {
                    Id = u.Id,
                    FullName = u.Name,
                    Initials = u.Name.Substring(0, 1).ToUpper(),
                    TotalSpent = u.Orders.Sum(o => o.TotalPrice)
                })
                .OrderByDescending(u => u.TotalSpent)
                .Take(top)
                .ToListAsync();

            for (int i = 0; i < users.Count; i++)
                users[i].Rank = i + 1;

            return users;
        }

        // ==============================
        // Users List
        // ==============================
        public async Task<PagedResult<UserListDto>> GetUsersAsync()
        {
            var query = _context.Users.AsQueryable();

            var totalCount = await query.CountAsync();

            var users = await query
                .Skip(0)
                .Take(totalCount)
                .Select(u => new UserListDto
                {
                    Id = u.Id,
                    FullName = u.Name,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber!,
                    OrdersCount = u.Orders.Count,
                    TotalSpent = u.Orders.Sum(o => o.TotalPrice),
                    LastOrderDate = u.Orders
                        .OrderByDescending(o => o.CreatedAt)
                        .Select(o => o.CreatedAt)
                        .FirstOrDefault(),
                    IsActive = u.IsActive,
                    JoinedAt = u.CreatedAt
                })
                .ToListAsync();

            return new PagedResult<UserListDto>
            {
                Items = users,
                TotalCount = totalCount,
                Page = 1,
                PageSize = totalCount
            };
        }
    }
}