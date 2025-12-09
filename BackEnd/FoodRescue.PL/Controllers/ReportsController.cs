using FoodRescue.BLL.Contract.Reports.Create;
using FoodRescue.BLL.Contract.Reports.Update;
using FoodRescue.BLL.Services.Reports;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodRescue.PL.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly IReportsService _reportsService;

        public ReportsController(IReportsService reportsService)
        {
            _reportsService = reportsService;
        }

        // GET /api/reports
        [HttpGet("")]
        public async Task<IActionResult> GetReports()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized();
            }

            var isAdminClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = isAdminClaim == "Admin";

            var reports = await _reportsService.ListReportsAsync(userId, isAdmin);

            return Ok(reports);
        }

        // POST /api/reports
        [HttpPost("")]
        public async Task<IActionResult> SubmitReport([FromBody] ReportRequest reportRequest)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized();
            }

            if (reportRequest.UserId != userId)
            {
                return Forbid("You cannot submit a report for another user.");
            }

            await _reportsService.SubmitReportAsync(reportRequest);
            return Ok(new { message = "Report submitted successfully" });
        }

        // PUT /api/reports/{id}/status
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")] 
        public async Task<IActionResult> UpdateReportStatus(Guid id, [FromBody] ReportStatusRequest statusRequest)
        {
            try
            {
                await _reportsService.UpdateReportStatusAsync(id, statusRequest);
                return Ok(new { message = "Report status updated successfully" });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Report not found" });
            }
        }
    }
}
