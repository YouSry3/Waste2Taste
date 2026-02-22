using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Abstractions.TypeErrors;
using FoodRescue.BLL.Contract.AdminDashbord.Dashboard.Response;
using FoodRescue.BLL.Contract.AdminDashbord.Users;
using FoodRescue.BLL.Contract.AdminDashbord.Users.Response;
using FoodRescue.BLL.Contract.AdminDashbord.Vendors.Response;
using FoodRescue.BLL.Extensions.Dashboard;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FoodRescue.BLL.ServicesWeb.Admin
{
    public class DashboardService : IDashboardServices
    {
        private readonly IDashboardRepository _dashboardRepo;

        public DashboardService(IDashboardRepository dashboardRepo)
        {
            _dashboardRepo = dashboardRepo;
        }

        public async Task<Result<DashboardResponse>> GetDashboardAsync(int days)
        {
            var response = new DashboardResponse
            {
                Summary = await GetSummaryAsync(days),
                Trends = await GetTrendsAsync(days),
                Categories = await GetCategoriesAsync()
            };

            return Result.Success<DashboardResponse>(response);
        }

        public async Task<Result<VendorOverviewDto>> GetOverviewAsync()
        {
            var overview = new VendorOverviewDto
            {
                TotalVendors = await _dashboardRepo.GetTotalVendorsAsync(),
                NgoPartners = await _dashboardRepo.GetNgoPartnersAsync(),
                ActiveListings = await _dashboardRepo.GetActiveListingsAsync(),
                TotalRevenue = await _dashboardRepo.GetTotalRevenueAsync(),
                TopPerformers = await _dashboardRepo.GetTopPerformersAsync(3)
            };

            return Result<VendorOverviewDto>.Success(overview);
        }

        public async Task<Result<PagedResultDto<VendorListItemDto>>> GetVendorsAsync(
         int page, int limit, string search, string sortBy, string order)
        {
            var data = await _dashboardRepo.GetVendorsAsync(page, limit, search, sortBy, order);
            return Result<PagedResultDto<VendorListItemDto>>.Success(data);
        }

        // ============================
        // 1️⃣ Dashboard
        // ============================
        public async Task<Result<DashboardOverviewDto>> GetUserOverViewAsync()
        {
            try
            {
                var totalUsers = await _dashboardRepo.GetTotalUsersAsync();
                var activeUsers = await _dashboardRepo.GetActiveUsersAsync();
                var totalOrders = await _dashboardRepo.GetTotalOrdersAsync();
                var topSpenders = await _dashboardRepo.GetTopSpendersAsync(3);

                var result = new DashboardOverviewDto
                {
                    TotalUsers = totalUsers,
                    ActiveUsers = activeUsers,
                    TotalOrders = totalOrders,
                    TopSpenders = topSpenders
                };

                return Result.Success(result);
            }
            catch (Exception ex)
            {
                return Result
                    .Failure<DashboardOverviewDto>(DashboardAdminErrors.OverviewLoadFailed);
            }
        }

        // ============================
        // 2️⃣ Top Spenders
        // ============================
        public async Task<Result<List<UserSummaryDto>>> GetTopSpendersAsync(int top)
        {
            try
            {
                if (top <= 0)
                    return Result
                        .Failure <List<UserSummaryDto>> (DashboardAdminErrors.DashboardLoadFailed);

                var users = await _dashboardRepo.GetTopSpendersAsync(top);

                return Result<List<UserSummaryDto>>.Success(users);
            }
            catch (Exception ex)
            {
                return Result
                    .Failure<List<UserSummaryDto>>(DashboardAdminErrors.ExternalServiceError("Top must be greater than zero.",ex.Message));
            }
        }

        // ============================
        // 3️⃣ Users List
        // ============================
        public async Task<Result<PagedResult<UserListDto>>> GetUsersAsync(UserFilter filter)
        {
            try
            {
                if (filter.Page <= 0)
                    filter.Page = 1;

                if (filter.PageSize <= 0)
                    filter.PageSize = 10;

                var users = await _dashboardRepo.GetUsersAsync(filter);

                return Result<PagedResult<UserListDto>>.Success(users);
            }
            catch (Exception ex)
            {
                return Result
                    .Failure<PagedResult<UserListDto>>(DashboardAdminErrors.ExternalServiceError("Error Server",ex.Message));
            }
        }

        // ---------------------------
        // Private Helpers
        // ---------------------------

        private async Task<SummarySection> GetSummaryAsync(int days)
        {
            return new SummarySection
            {
                TotalRevenue = (await _dashboardRepo.GetTotalRevenueAsync(days)).Value,
                OrdersLastDays = (await _dashboardRepo.GetOrdersCountAsync(days)).Value,
                ActiveUsers = (await _dashboardRepo.GetActiveUsersCountAsync(days)).Value,
                Vendors = (await _dashboardRepo.GetVendorsCountAsync(days)).Value
            };
        }

        private async Task<List<MonthlyTrendDto>> GetTrendsAsync(int days)
        {
            return await _dashboardRepo.GetMonthlyTrendsAsync(days);
        }

        private async Task<List<CategoryDistributionDto>> GetCategoriesAsync()
        {
            return await _dashboardRepo.GetCategoryDistributionAsync();
        }

       
    }
}
