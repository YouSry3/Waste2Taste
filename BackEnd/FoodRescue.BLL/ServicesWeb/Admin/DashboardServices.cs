using FoodRescue.BLL.ResultPattern;
using FoodRescue.BLL.ResultPattern.TypeErrors;
using FoodRescue.BLL.Contract.AdminDashbord.Dashboard.Response;
using FoodRescue.BLL.Contract.AdminDashbord.Users;
using FoodRescue.BLL.Contract.AdminDashbord.Users.Response;
using FoodRescue.BLL.Contract.AdminDashbord.Vendors.Response;
using FoodRescue.DAL.Extensions.Dashboard;

namespace FoodRescue.BLL.ServicesWeb.Admin
{
    public class DashboardService : IDashboardServices
    {
        private readonly IDashboardRepository _dashboardRepo;

        public DashboardService(IDashboardRepository dashboardRepo)
        {
            _dashboardRepo = dashboardRepo;
        }

        // ============================
        // Dashboard Main
        // ============================
        public async Task<Result<DashboardResponse>> GetDashboardAsync(int days)
        {
            try
            {
                var response = new DashboardResponse
                {
                    Summary = await GetSummaryAsync(days),
                    Trends = await GetTrendsAsync(days),
                    Categories = await GetCategoriesAsync()
                };

                return Result.Success(response);
            }
            catch
            {
                return Result.Failure<DashboardResponse>(
                    DashboardAdminErrors.DashboardLoadFailed);
            }
        }

        // ============================
        // Vendors Overview
        // ============================
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

            return Result.Success(overview);
        }

        // ============================
        // Vendors List
        // ============================
        public async Task<Result<PagedResultDto<VendorListItemDto>>> GetVendorsAsync(
            int page, int limit, string search, string sortBy, string order)
        {
            var data = await _dashboardRepo.GetVendorsAsync(page, limit, search, sortBy, order);

            return Result.Success(data);
        }

        // ============================
        // Users Dashboard
        // ============================
        public async Task<Result<DashboardOverviewDto>> GetUserOverViewAsync()
        {
            try
            {
                var result = new DashboardOverviewDto
                {
                    TotalUsers = await _dashboardRepo.GetTotalUsersAsync(),
                    ActiveUsers = await _dashboardRepo.GetActiveUsersAsync(),
                    TotalOrders = await _dashboardRepo.GetTotalOrdersAsync(),
                    TopSpenders = await _dashboardRepo.GetTopSpendersAsync(3)
                };

                return Result.Success(result);
            }
            catch
            {
                return Result.Failure<DashboardOverviewDto>(
                    DashboardAdminErrors.OverviewLoadFailed);
            }
        }

        // ============================
        // Top Spenders
        // ============================
        public async Task<Result<List<UserSummaryDto>>> GetTopSpendersAsync(int top)
        {
            try
            {
                if (top <= 0)
                    return Result.Failure<List<UserSummaryDto>>(
                        DashboardAdminErrors.DashboardLoadFailed);

                var users = await _dashboardRepo.GetTopSpendersAsync(top);

                return Result.Success(users);
            }
            catch (Exception ex)
            {
                return Result.Failure<List<UserSummaryDto>>(
                    DashboardAdminErrors.ExternalServiceError(
                        "Top must be greater than zero.", ex.Message));
            }
        }

        // ============================
        // Users List
        // ============================
        public async Task<Result<PagedResult<UserListDto>>> GetUsersAsync()
        {
            try
            {
                var users = await _dashboardRepo.GetUsersAsync();

                return Result.Success(users);
            }
            catch (Exception ex)
            {
                return Result.Failure<PagedResult<UserListDto>>(
                    DashboardAdminErrors.ExternalServiceError("Server Error", ex.Message));
            }
        }
        // ===================================================
        // Private Helpers
        // ===================================================

        private async Task<SummarySection> GetSummaryAsync(int days)
        {
            var currentRevenue = (await _dashboardRepo.GetTotalRevenueAsync(days)).Value;
            var previousRevenue = (await _dashboardRepo.GetTotalRevenueAsync(days, days)).Value;

            var currentOrders = (await _dashboardRepo.GetOrdersCountAsync(days)).Value;
            var previousOrders = (await _dashboardRepo.GetOrdersCountAsync(days, days)).Value;

            var currentUsers = (await _dashboardRepo.GetActiveUsersCountAsync(days)).Value;
            var previousUsers = (await _dashboardRepo.GetActiveUsersCountAsync(days, days)).Value;

            var currentVendors = (await _dashboardRepo.GetVendorsCountAsync(days)).Value;
            var previousVendors = (await _dashboardRepo.GetVendorsCountAsync(days, days)).Value;

            return new SummarySection
            {
                TotalRevenue = currentRevenue,
                OrdersLastDays = currentOrders,
                ActiveUsers = currentUsers,
                Vendors = currentVendors,

                RevenueGrowthPercentage = CalculateGrowth(currentRevenue, previousRevenue),
                OrderGrowthPercentage = CalculateGrowth(currentOrders, previousOrders),
                UserGrowthPercentage = CalculateGrowth(currentUsers, previousUsers),
                VendorGrowthPercentage = CalculateGrowth(currentVendors, previousVendors)
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

        // ===================================================
        // Growth Calculator
        // ===================================================
        private decimal CalculateGrowth(decimal current, decimal previous)
        {
            if (previous == 0)
                return current > 0 ? 100 : 0;

            return Math.Round(((current - previous) / previous) * 100, 2);
        }

        private decimal CalculateGrowth(int current, int previous)
        {
            if (previous == 0)
                return current > 0 ? 100 : 0;

            return Math.Round(((decimal)(current - previous) / previous) * 100, 2);
        }
    }
}