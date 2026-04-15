using FoodRescue.BLL.Contract.VendorDashboard;
using FoodRescue.BLL.Extensions.Dashboard;

namespace FoodRescue.BLL.ServicesWeb.VendorDashboard;


public class VendorDashboardService : IVendorDashboardService
{
    private readonly IVendorDashboardRepository _repository;

    public VendorDashboardService(IVendorDashboardRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<VendorDashboardResponse>> GetDashboardAsync(Guid vendorId)
    {
        // FIXED: Execute sequentially 
        var stats = await GetStatsAsync(vendorId);
        var goals = await _repository.GetMonthlyGoalsProgressAsync(vendorId);
        var expiringProducts = await _repository.GetExpiringSoonProductsAsync(vendorId, 24);
        var recentOrders = await _repository.GetRecentOrdersAsync(vendorId, 5);
        var topCustomers = await _repository.GetTopCustomersAsync(vendorId, 7);
        var environmental = await _repository.GetEnvironmentalImpactAsync(vendorId);

        var response = new VendorDashboardResponse
        {
            Stats = stats,
            MonthlyGoals = new MonthlyGoalsDto
            {
                FoodSavedCurrent = goals.FoodSavedCurrent,
                FoodSavedTarget = goals.FoodSavedTarget,
                RevenueCurrent = goals.RevenueCurrent,
                RevenueTarget = goals.RevenueTarget,
                RatingCurrent = goals.RatingCurrent,
                RatingTarget = goals.RatingTarget
            },
            ExpiringSoon = expiringProducts.Select(p => new ExpiringProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Stock = p.Quantity,
                ExpiresAt = p.ExpiryDate,
                TimeRemaining = CalculateTimeRemaining(p.ExpiryDate),
                IsUrgent = (p.ExpiryDate - DateTime.Now).TotalHours < 2
            }).ToList(),
            RecentOrders = recentOrders.Select(o => new RecentOrderDto
            {
                OrderId = $"#ORD-{o.Id.ToString()[..8].ToUpper()}",
                CustomerName = o.Customer?.Name ?? "Unknown",
                CustomerPhone = o.Customer?.PhoneNumber,
                ProductName = o.Product?.Name ?? "Unknown",
                Amount = o.TotalPrice,
                PickupTime = o.PickupTime.ToString("h:mm tt"),
                PickupLocation = o.Product?.Vendor?.Address ?? "Not specified",
                Status = o.Status,
                VendorPhone = o.Product?.Vendor?.PhoneNumber
            }).ToList(),
            TopCustomers = topCustomers.Select(c => new TopCustomerDto
            {
                Name = c.CustomerName,
                OrderCount = c.OrderCount,
                TotalSpent = c.TotalSpent,
                Rating = c.Rating
            }).ToList(),
            EnvironmentalImpact = new EnvironmentalImpactDto
            {
                FoodSavedLbs = environmental.FoodSavedLbs,
                Co2PreventedKg = environmental.Co2PreventedKg,
                MealsProvided = environmental.MealsProvided
            }
        };

        return Result.Success(response);
    }

    private async Task<VendorDashboardStatsResponse> GetStatsAsync(Guid vendorId)
    {
        // FIXED: Execute sequentially here too
        var activeListings = await _repository.GetActiveListingsCountAsync(vendorId);
        var revenue = await _repository.GetTotalRevenueAsync(vendorId, 30);
        var orders = await _repository.GetTotalOrdersCountAsync(vendorId);
        var foodSavedKg = await _repository.GetFoodSavedKgAsync(vendorId);
        var pickupsToday = await _repository.GetPickupsTodayCountAsync(vendorId);
        var rating = await _repository.GetAverageRatingAsync(vendorId);

        return new VendorDashboardStatsResponse
        {
            ActiveListings = activeListings,
            Revenue30Days = revenue,
            TotalOrders = orders,
            FoodSavedLbs = foodSavedKg * 2.20462,
            PickupsToday = pickupsToday,
            AverageRating = Math.Round(rating, 1)
        };
    }

    private static string CalculateTimeRemaining(DateTime expiryDate)
    {
        var timeLeft = expiryDate - DateTime.Now;

        if (timeLeft.TotalMinutes <= 0)
            return "Expired";
        if (timeLeft.TotalHours < 1)
            return $"{(int)timeLeft.TotalMinutes}m";
        if (timeLeft.TotalHours < 24)
            return $"{(int)timeLeft.TotalHours}h";
        return $"{(int)timeLeft.TotalDays}d";
    }
}
