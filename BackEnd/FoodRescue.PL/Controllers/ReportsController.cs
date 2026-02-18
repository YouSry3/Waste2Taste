using FoodRescue.BLL.Contract.Reports.Create;
using FoodRescue.BLL.Contract.Reports.Update;
using FoodRescue.BLL.Extensions.Users;
using FoodRescue.BLL.Services.Reports;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodRescue.PL.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    [Authorize]
    public class ReportsController(IReportsService reportsService, IUserRepository UserRepository) : ControllerBase
    {
        private readonly IReportsService _reportsService = reportsService;
        private readonly IUserRepository _UserRepository = UserRepository;



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

            
            await _reportsService.SubmitReportAsync(reportRequest, userId);
            return Ok(new { message = "Report submitted successfully" });
        }

        // PUT /api/reports/status
        [HttpPut("Toggle-status")]
        [Authorize(Roles = "Admin")] 
        public async Task<IActionResult> UpdateReportStatus(Guid id, [FromBody] ReportStatusRequest statusRequest)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized();
            }
            var user = await _UserRepository.GetByIdAsync(userId);

            if (user == null) 
                return NotFound(new { message = "Reporter not found" });
            

            if(user.Role != "Admin")
                return Problem("No Access To Edited in this Status");

            await _reportsService.UpdateReportStatusAsync(userId, statusRequest);
            return Ok(new { message = "Report status updated successfully" });
        }
    }
}
