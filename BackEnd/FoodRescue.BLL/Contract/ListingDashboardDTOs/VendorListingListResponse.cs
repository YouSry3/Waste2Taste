namespace FoodRescue.BLL.Contract.ListingDashboardDTOs;

public class VendorListingListResponse
{
    public int ActiveCount { get; set; }
    public List<VendorListingDto> Listings { get; set; } = new();
}
