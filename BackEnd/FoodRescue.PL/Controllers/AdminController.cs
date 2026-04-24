using FoodRescue.BLL.Contract.AdminDashbord.Users;
using FoodRescue.BLL.Contract.AdminDashbord.Vendors.Request;
using FoodRescue.BLL.Contract.AdminDashbord.Users;
using FoodRescue.BLL.Contract.AnalyticsDashboardTabDTOs;
using FoodRescue.BLL.Contract.AdminDashbord.Dashboard.Response;
using FoodRescue.BLL.Contract.AdminDashbord.Users.Response;
using FoodRescue.BLL.Contract.AdminDashbord.Vendors.Response;
using FoodRescue.BLL.Contract.AdminDashbord.Moderation;
using FoodRescue.BLL.ServicesWeb.Admin;
using FoodRescue.BLL.ServicesWeb.Admin.Moderation;
using FoodRescue.BLL.Services.AnalyticsDashboardTab;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FoodRescue.PL.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class AdminController(IDashboardServices dashboardServices, IModerationService moderationService, IVendorAnalyticsService analyticsService) : ControllerBase
    {
        private readonly IDashboardServices _dashboardServices = dashboardServices;
        private readonly IModerationService _moderationService = moderationService;
        private readonly IVendorAnalyticsService _analyticsService = analyticsService;

        /// <summary>
        /// Retrieves dashboard data for the specified number of days.
        /// </summary>
        /// <remarks>
        /// This endpoint is accessible only to users with the "admin" role. The data is
        /// retrieved from the dashboard service and includes summary, trends, and category distribution.
        /// </remarks>
        /// <param name="days">The number of days for which to retrieve dashboard data. Must be a positive integer.</param>
        /// <returns>Dashboard data with summary, trends, and category distribution</returns>
        /// <response code="200">Dashboard data retrieved successfully</response>
        /// <response code="400">Invalid days parameter or server error</response>
        /// <response code="401">Unauthorized - Admin token required</response>
        [HttpGet("Dashboard")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(typeof(DashboardResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [Produces("application/json")]
        public async Task<IActionResult> GetDashboardAdminAsync([FromHeader] int days)
        {
            var dashboardData = await _dashboardServices.GetDashboardAsync(days);
            return Ok(new { Data = dashboardData.Value });
        }

        /// <summary>
        /// Retrieves an overview of vendor-related data for the dashboard.
        /// </summary>
        /// <remarks>
        /// Returns a summary of vendor-related metrics including total vendors, NGO partners, 
        /// active listings, total revenue, and top performing vendors.
        /// </remarks>
        /// <returns>Vendor overview data with metrics and top performers</returns>
        /// <response code="200">Vendor overview data retrieved successfully</response>
        /// <response code="400">Failed to load vendor overview data</response>
        /// <response code="401">Unauthorized - Admin token required</response>
        [HttpGet("Vendors-overview")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(typeof(VendorOverviewDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [Produces("application/json")]
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
        /// <remarks>
        /// Supports filtering, sorting, and pagination of vendor data. Query parameters allow 
        /// flexible retrieval of vendor information.
        /// </remarks>
        /// <param name="query">Query parameters including page, limit, search, sortBy, and order</param>
        /// <returns>Paginated vendor list with filter and sort applied</returns>
        /// <response code="200">Paginated vendor list retrieved successfully</response>
        /// <response code="400">Invalid query parameters</response>
        /// <response code="401">Unauthorized - Admin token required</response>
        [HttpGet("Vendors")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(typeof(PagedResultDto<VendorListItemDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [Produces("application/json")]
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
        /// <remarks>
        /// Returns a summary of key user metrics including total users, active users, 
        /// total orders placed, and a list of top spenders with their spending details.
        /// </remarks>
        /// <returns>User overview data with metrics and top spenders</returns>
        /// <response code="200">User overview data retrieved successfully with metrics and top spenders</response>
        /// <response code="400">Failed to load user overview data</response>
        /// <response code="401">Unauthorized - Admin token required</response>
        [HttpGet("Users-OverView")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(typeof(DashboardOverviewDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [Produces("application/json")]
        public async Task<IActionResult> GetDashboard()
        {
            var result = await _dashboardServices.GetUserOverViewAsync();

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }

        /// <summary>
        /// Retrieves a filtered list of users from the system.
        /// </summary>
        /// <remarks>
        /// Returns a paginated list of users with optional filtering by role, status, and other attributes.
        /// </remarks>
        /// <param name="filter">Filter criteria for user search</param>
        /// <returns>Filtered list of users with pagination information</returns>
        /// <response code="200">User list retrieved successfully</response>
        /// <response code="400">Invalid filter parameters</response>
        /// <response code="401">Unauthorized - Admin token required</response>
        [HttpGet("Users-Table")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(typeof(PagedResult<UserListDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [Produces("application/json")]
        public async Task<IActionResult> GetUsers()
        {
            var result = await _dashboardServices.GetUsersAsync();

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }

        /// <summary>
        /// Retrieves a comprehensive summary of all items requiring moderation attention.
        /// </summary>
        /// <remarks>
        /// Returns counts of product listings awaiting approval, flagged listings, 
        /// vendor requests awaiting approval, and open customer reports.
        /// </remarks>
        /// <returns>Moderation summary with item counts and timestamp</returns>
        /// <response code="200">Moderation summary retrieved successfully</response>
        /// <response code="500">Server error while retrieving moderation summary</response>
        [HttpGet("moderation/summary")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(typeof(ModerationSummaryDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        [Produces("application/json")]
        public async Task<IActionResult> GetModerationSummary()
        {
            try
            {
                var summary = await _moderationService.GetModerationSummaryAsync();
                return Ok(new { Data = summary });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = "An error occurred while retrieving the moderation summary", Details = ex.Message });
            }
        }

    

    }
}
