using FoodRescue.BLL.Contract.AdminDashbord.Vendors.Request;
using FoodRescue.BLL.ServicesWeb.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FoodRescue.PL.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class AdminController(IDashboardServices dashboardServices) : ControllerBase
    {
        private readonly IDashboardServices _dashboardServices = dashboardServices;

        [HttpGet("Dashboard")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetDashboardAdminAsync([FromHeader]int days)
        {
            var dashboardData = await _dashboardServices.GetDashboardAsync(days);

            return Ok(new { Data= dashboardData.Value });
        }

        [HttpGet("Vendors-overview")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetOverview()
        {
            var result = await _dashboardServices.GetOverviewAsync();

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }

        [HttpGet("Vendors")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetVendors([FromBody] VendorQueryParameters query)
        {
            var result = await _dashboardServices.GetVendorsAsync(
                query.Page,
                query.Limit,
                query.Search!,
                query.SortBy,
                query.Order);

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }


        [HttpGet("Users")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetUsersAsync()
        {

            return Ok();
        }

    }
}
