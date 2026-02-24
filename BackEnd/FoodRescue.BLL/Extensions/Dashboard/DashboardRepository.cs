
using FoodRescue.BLL.ResultPattern;
using FoodRescue.BLL.Contract.AdminDashbord.Dashboard.Response;
using FoodRescue.BLL.Contract.AdminDashbord.Users;
using FoodRescue.BLL.Contract.AdminDashbord.Users.Response;
using FoodRescue.BLL.Contract.AdminDashbord.Vendors.Response;
using FoodRescue.BLL.Extensions;
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
        public async Task<int> GetTotalVendorsAsync()
       => await _context.Vendors.CountAsync();

        public async Task<int> GetNgoPartnersAsync()
            => await _context.Vendors
                .CountAsync(v => v.Status == "NGO");

        public async Task<int> GetActiveListingsAsync()
            => await _context.Products
                .CountAsync(p => p.Expired == false);

        public async Task<decimal> GetTotalRevenueAsync()
            => await _context.Orders
                .Where(o => o.Status == "completed")
                .SumAsync(o => o.TotalPrice);

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

        public async Task<PagedResultDto<VendorListItemDto>> GetVendorsAsync(
            int page,
            int limit,
            string search,
            string sortBy,
            string order)
        {
            var query = _context.Vendors.AsQueryable();

            if (!string.IsNullOrEmpty(search))
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
                    ListingsCount = _context.Products
                        .Count(p => p.VendorId == v.Id),
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
        // 1️⃣ Total Users
        // ==============================
        public async Task<int> GetTotalUsersAsync()
        {
            return await _context.Users.CountAsync();
        }

        // ==============================
        // 2️⃣ Active Users
        // ==============================
        public async Task<int> GetActiveUsersAsync()
        {
            return await _context.Users
                .Where(u => u.IsActive)
                .CountAsync();
        }

        // ==============================
        // 3️⃣ Total Orders
        // ==============================
        public async Task<int> GetTotalOrdersAsync()
        {
            return await _context.Orders.CountAsync();
        }
        // ==============================
        // 4️⃣ Top Spenders
        // ==============================
        public async Task<List<UserSummaryDto>> GetTopSpendersAsync(int top)
        {
            var users = await _context.Users
                .Select(u => new UserSummaryDto
                {
                    Id = u.Id,
                    FullName = u.Name,
                    Initials = (u.Name.Substring(0, 1)).ToUpper(),
                    TotalSpent = u.Orders.Sum(o => o.TotalPrice)
                })
                .OrderByDescending(u => u.TotalSpent)
                .Take(top)
                .ToListAsync();

            // Assign Rank
            for (int i = 0; i < users.Count; i++)
            {
                users[i].Rank = i + 1;
            }

            return users;
        }


        // ==============================
        // 5️⃣ Users List with Filter + Paging
        // ==============================
        public async Task<PagedResult<UserListDto>> GetUsersAsync(UserFilter filter)
        {
            var query = _context.Users.AsQueryable();

            // 🔍 Search
            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                query = query.Where(u =>
                    (u.Name)
                    .Contains(filter.Search));
            }

            // 📌 Status Filter
            if (!string.IsNullOrWhiteSpace(filter.Status))
            {
                if (filter.Status == "Active")
                    query = query.Where(u => u.IsActive);
                else if (filter.Status == "Inactive")
                    query = query.Where(u => !u.IsActive);
            }

            // 📊 Sorting
            query = filter.SortBy switch
            {
                "Name" => filter.Ascending
                    ? query.OrderBy(u => u.Name)
                    : query.OrderByDescending(u => u.Name),

                "Orders" => filter.Ascending
                    ? query.OrderBy(u => u.Orders.Count)
                    : query.OrderByDescending(u => u.Orders.Count),

                "Spend" => filter.Ascending
                    ? query.OrderBy(u => u.Orders.Sum(o => o.TotalPrice))
                    : query.OrderByDescending(u => u.Orders.Sum(o => o.TotalPrice)),

                "LastOrder" => filter.Ascending
                    ? query.OrderBy(u => u.Orders.Max(o => o.CreatedAt))
                    : query.OrderByDescending(u => u.Orders.Max(o => o.CreatedAt)),

                _ => query.OrderByDescending(u => u.CreatedAt)
            };

            var totalCount = await query.CountAsync();

            var users = await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
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
                Page = filter.Page,
                PageSize = filter.PageSize
            };



        }
    }
}

