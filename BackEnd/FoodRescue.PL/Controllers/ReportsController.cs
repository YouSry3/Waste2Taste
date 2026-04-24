using FoodRescue.BLL.Contract.Reports.Create;
using FoodRescue.BLL.Contract.Reports.Update;
using FoodRescue.BLL.Contract.Reports.Response;
using FoodRescue.BLL.Extensions.Users;
using FoodRescue.BLL.Services.Reports;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodRescue.PL.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class ReportsController(IReportsService reportsService, IUserRepository userRepository) : ControllerBase
    {
        private readonly IReportsService _reportsService = reportsService;
        private readonly IUserRepository _userRepository = userRepository;

        /// <summary>
        /// Get all reports (Admin only)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAllReports()
        {
            var result = await _reportsService.GetAllReportsAsync();
            if (result.IsFailure)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }

        /// <summary>
        /// Get my reports (Customer/User)
        /// </summary>
        [HttpGet("my-reports")]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetMyReports()
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty)
                return Unauthorized();

            var result = await _reportsService.GetReportsByUserAsync(userId);
            if (result.IsFailure)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }

        /// <summary>
        /// Get report by ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetReportById(Guid id)
        {
            var result = await _reportsService.GetReportByIdAsync(id);
            if (result.IsFailure)
                return NotFound(result.Error);

            return Ok(result.Value);
        }

        /// <summary>
        /// Search and filter reports
        /// </summary>
        [HttpGet("search/filtered")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> SearchReports([FromQuery] string? status = null, [FromQuery] string? search = null)
        {
            var result = await _reportsService.GetFilteredReportsAsync(status, search);
            if (result.IsFailure)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }

        /// <summary>
        /// Create a new report
        /// </summary>
        [HttpPost]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [Authorize(Roles ="customer")]
        public async Task<IActionResult> CreateReport([FromBody] CreateReportDto dto)
        {
            
            var user = await _userRepository.GetByIdAsync(GetCurrentUserId());
            if (user == null)
                return NotFound("User not found");

            var result = await _reportsService.CreateReportAsync(dto, GetCurrentUserId(), user.Name);
            if (result.IsFailure)
                return BadRequest(result.Error);

            return CreatedAtAction(nameof(GetReportById), new { id = result.Value.Id }, result.Value);
        }

        /// <summary>
        /// Update report status (Admin only)
        /// </summary>
        [HttpPut("{id}/status")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> UpdateReportStatus(Guid id, [FromBody] UpdateReportStatusDto dto)
        {
            var result = await _reportsService.UpdateReportStatusAsync(id, dto);
            if (result.IsFailure)
                return NotFound(result.Error);

            return Ok(result.Value);
        }

        /// <summary>
        /// Add response to report
        /// </summary>
        [HttpPost("{id}/response")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> AddResponse(Guid id, [FromBody] CreateResponseDto dto)
        {
            if (dto.ReportId != id)
                return BadRequest("Report ID mismatch");

            var userId = GetCurrentUserId();
            if (userId == Guid.Empty)
                return Unauthorized();

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                return NotFound("User not found");

            var result = await _reportsService.AddResponseAsync(dto, userId, user.Name);
            if (result.IsFailure)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }

        /// <summary>
        /// Get report statistics
        /// </summary>
        [HttpGet("stats/overview")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetStats()
        {
            var result = await _reportsService.GetReportStatsAsync();
            if (result.IsFailure)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }

        // Legacy endpoints for backward compatibility
        [HttpGet("legacy/all")]
        public async Task<IActionResult> GetReportsLegacy()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
                return Unauthorized();

            var isAdminClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = isAdminClaim == "Admin";

            var reports = await _reportsService.ListReportsAsync(userId, isAdmin);
            return Ok(reports);
        }

        [HttpPost("legacy/submit")]
        public async Task<IActionResult> SubmitReportLegacy([FromBody] ReportRequest reportRequest)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
                return Unauthorized();

            await _reportsService.SubmitReportAsync(reportRequest, userId);
            return Ok(new { message = "Report submitted successfully" });
        }

        [HttpPut("legacy/{id}/toggle-status")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateReportStatusLegacy(Guid id, [FromBody] ReportStatusRequest statusRequest)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
                return Unauthorized();

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                return NotFound(new { message = "Reporter not found" });

            if (user.Role != "Admin")
                return Forbid();

            await _reportsService.UpdateReportStatusAsync(id, statusRequest);
            return Ok(new { message = "Report status updated successfully" });
        }

        // Helper Methods
        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
        }
    }
}

