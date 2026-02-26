namespace FoodRescue.BLL.Contract.VendorDashboard;

public class MonthlyGoalsDto
{
    public double FoodSavedCurrent { get; set; }
    public double FoodSavedTarget { get; set; }
    public int FoodSavedPercentage => FoodSavedTarget > 0
        ? (int)(FoodSavedCurrent / FoodSavedTarget * 100) : 0;

    public decimal RevenueCurrent { get; set; }
    public decimal RevenueTarget { get; set; }
    public int RevenuePercentage => RevenueTarget > 0
        ? (int)(RevenueCurrent / RevenueTarget * 100) : 0;

    public double RatingCurrent { get; set; }
    public double RatingTarget { get; set; }
    public int RatingPercentage => RatingTarget > 0
        ? (int)(RatingCurrent / RatingTarget * 100) : 0;
}
