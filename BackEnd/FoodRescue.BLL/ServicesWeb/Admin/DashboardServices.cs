using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Contract.AdminDashbord.Dashboard.Response;
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
            var response = new DashboardResponse();

            response.Summary = await GetSummaryAsync(days);
            response.Trends = await GetTrendsAsync(days);
            response.Categories = await GetCategoriesAsync();

            return Result.Success<DashboardResponse>(response);
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
