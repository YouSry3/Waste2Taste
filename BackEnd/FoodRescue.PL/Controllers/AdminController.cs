using FoodRescue.BLL.Contract.AdminDashbord.Users;
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
        
        /// <summary>
        /// Retrieves dashboard data for the specified number of days.
        /// </summary>
        /// <remarks>This endpoint is accessible only to users with the "admin" role. The data is
        /// retrieved from the dashboard service and returned in the response body as a JSON object.</remarks>
        /// <param name="days">The number of days for which to retrieve dashboard data. Must be a positive integer.</param>
        /// <returns>An <see cref="IActionResult"/> containing the dashboard data in the response body.</returns>
        [HttpGet("Dashboard")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetDashboardAdminAsync([FromHeader]int days)
        {
            var dashboardData = await _dashboardServices.GetDashboardAsync(days);

            return Ok(new { Data= dashboardData.Value });
        }
        /// <summary>
        /// Retrieves an overview of vendor-related data for the dashboard.
        /// </summary>
        /// <remarks>This endpoint is accessible only to users with the "admin" role.  It returns a
        /// summary of vendor-related metrics or data as provided by the dashboard service.</remarks>
        /// <returns>An <see cref="IActionResult"/> containing the overview data if the operation is successful;  otherwise, a
        /// bad request response with an error message.</returns>

        [HttpGet("Vendors-overview")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetOverview()
        {
            var result = await _dashboardServices.GetOverviewAsync();

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }
        /// <summary>
        /// Retrieves a paginated list of vendors based on the specified query parameters.
        /// </summary>
        /// <remarks>This endpoint is restricted to users with the "admin" role. The query parameters
        /// allow for flexible filtering  and sorting of the vendor data. Ensure that the <paramref name="query"/>
        /// object is properly populated before  making the request.</remarks>
        /// <param name="query">The parameters used to filter, sort, and paginate the list of vendors.  This includes page number, page
        /// size, search term, sort field, and sort order.</param>
        /// <returns>An <see cref="IActionResult"/> containing the paginated list of vendors if the operation is successful; 
        /// otherwise, a bad request response with an error message.</returns>

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


      
        
        /// <summary>
        /// Retrieves an overview of user statistics and top spenders for the dashboard.
        /// </summary>
        /// <remarks>This method is accessible only to users with the "admin" role. It returns a summary
        /// of key user metrics  and a list of top spenders, which can be used to populate the dashboard.</remarks>
        /// <returns>An <see cref="IActionResult"/> containing the dashboard overview data if the operation is successful;
        /// otherwise, a bad request response with an error message.</returns>
        [HttpGet("Users-OverView")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetDashboard()
        {
            var result = await _dashboardServices.GetOverviewAsync();

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }

        /// <summary>
        /// Retrieves a filtered list of users from the system.
        /// </summary>
        /// <remarks>This endpoint is restricted to users with the "admin" role. Ensure the provided
        /// <paramref name="filter"/>  contains valid criteria to avoid errors. The response will include the filtered
        /// user data in the body  if the operation is successful.</remarks>
        /// <param name="filter">The criteria used to filter the users. This includes properties such as role, status, or other user
        /// attributes.</param>
        /// <returns>An <see cref="IActionResult"/> containing the filtered list of users if the operation is successful,  or a
        /// <see cref="BadRequestObjectResult"/> with an error message if the operation fails.</returns>
        [HttpGet("Users-Table")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetUsers([FromBody] UserFilter filter)
        {
            var result = await _dashboardServices.GetUsersAsync(filter);

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }

    }
}
