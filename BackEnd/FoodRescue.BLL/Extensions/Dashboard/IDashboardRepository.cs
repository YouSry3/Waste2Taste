using FoodRescue.BLL.ResultPattern;
using FoodRescue.BLL.Contract.AdminDashbord.Dashboard.Response;
using FoodRescue.BLL.Contract.AdminDashbord.Users;
using FoodRescue.BLL.Contract.AdminDashbord.Users.Response;
using FoodRescue.BLL.Contract.AdminDashbord.Vendors.Response;

namespace FoodRescue.DAL.Extensions.Dashboard
{
    public interface IDashboardRepository
    {
        Task<Result<decimal>> GetTotalRevenueAsync(int days, int skipDays = 0);
        Task<Result<int>> GetOrdersCountAsync(int days, int skipDays = 0);
        Task<Result<int>> GetActiveUsersCountAsync(int days, int skipDays = 0);
        Task<Result<int>> GetVendorsCountAsync(int days, int skipDays = 0);

        Task<List<MonthlyTrendDto>> GetMonthlyTrendsAsync(int days);
        Task<List<CategoryDistributionDto>> GetCategoryDistributionAsync();

        Task<int> GetTotalVendorsAsync();
        Task<int> GetNgoPartnersAsync();
        Task<int> GetActiveListingsAsync();
        Task<decimal> GetTotalRevenueAsync();

        Task<List<TopVendorDto>> GetTopPerformersAsync(int count);

        Task<PagedResultDto<VendorListItemDto>> GetVendorsAsync(
            int page,
            int limit,
            string search,
            string sortBy,
            string order);

        Task<int> GetTotalUsersAsync();
        Task<int> GetActiveUsersAsync();
        Task<int> GetTotalOrdersAsync();

        Task<List<UserSummaryDto>> GetTopSpendersAsync(int top);

        Task<PagedResult<UserListDto>> GetUsersAsync(UserFilter filter);
    }
}