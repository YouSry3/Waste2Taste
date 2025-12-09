using FoodRescue.BLL.Contract.Donations;
using FoodRescue.BLL.Services.Donations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FoodRescue.PL.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class DonationsController(IDonationService donationService) : ControllerBase
    {
        private readonly IDonationService _donationService = donationService;

        [HttpPost("donations")]
        public async Task<IActionResult> CreateDonation([FromBody] DonationRequest request)
        {
            

            var vendorId = GetVendorIdFromContext();

            var donation = await _donationService.CreateDonationAsync(vendorId, request);

            return Ok(donation);
        }

        [HttpGet("donations")]
        public async Task<IActionResult> GetAllDonations()
        {
            var donations = await _donationService.GetAllDonationsAsync();
            return Ok(donations);
        }

        [HttpGet("vendors/donations")]
        public async Task<IActionResult> GetDonationsForVendor()
        {
            var vendorId = GetVendorIdFromContext();
            var donations = await _donationService.GetDonationsByVendorAsync(vendorId);
            return Ok(donations);
        }

        [HttpPut("donations/Tuggle-status")]
        public async Task<IActionResult> UpdateDonationStatus(Guid id, [FromBody] string status)
        {
            var updated = await _donationService.UpdateDonationStatusAsync(id, status);
            if (!updated)
                return NotFound();

            return NoContent();
        }

        private Guid GetVendorIdFromContext()
        {
            var vendorIdClaim = User.Claims.FirstOrDefault(c => c.Type == "VendorId");
            return vendorIdClaim != null ? Guid.Parse(vendorIdClaim.Value) : Guid.Empty;
        }
    }
}
