using FoodRescue.BLL.Contract.Donations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Services.Donations
{
    public interface IDonationService
    {
        Task<DonationResponse> CreateDonationAsync(Guid vendorId, DonationRequest request);
        Task<IEnumerable<DonationResponse>> GetAllDonationsAsync();
        Task<IEnumerable<DonationResponse>> GetDonationsByVendorAsync(Guid vendorId);
        Task<bool> UpdateDonationStatusAsync(Guid donationId, string status);
    }

}
