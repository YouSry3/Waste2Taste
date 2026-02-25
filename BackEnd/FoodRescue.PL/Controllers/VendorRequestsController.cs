using FoodRescue.BLL.Contract.VendorDashboard;
using FoodRescue.BLL.Services.Vendors;
using FoodRescue.DAL.Consts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodRescue.PL.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class VendorRequestsController : ControllerBase
    {
        private readonly IVendorRequestService _vendorRequestService;

        public VendorRequestsController(IVendorRequestService vendorRequestService)
        {
            _vendorRequestService = vendorRequestService ;
        }

        [HttpPost]
        [Authorize(Roles = "vendor")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> CreateVendorRequest([FromBody] VendorDataRequest request)
        {
            var userId = GetUserIdFromClaims();
            if (userId == Guid.Empty)
                return Unauthorized(UserErrors.OnlyVendorAccess);

            var result = await _vendorRequestService.CreateVendorRequestAsync(request, userId);

            if (!result.IsSuccess)
                return BadRequest(new { Error = result.Error! });

            return Ok(new { Data = new { Id = result.Value }, Message = "Vendor request created successfully" });
        }

        [HttpGet("{vendorRequestId}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetVendorRequest(Guid vendorRequestId)
        {
            var result = await _vendorRequestService.GetVendorRequestAsync(vendorRequestId);

            if (!result.IsSuccess)
                return NotFound(new { Error = result.Error! });

            return Ok(new { Data = result.Value });
        }

        [HttpGet("pending/all")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetPendingVendorRequests()
        {
            var result = await _vendorRequestService.GetPendingVendorRequestsAsync();

            if (!result.IsSuccess)
                return BadRequest(new { Error = result.Error! });

            return Ok(new { Data = result.Value });
        }

        [HttpGet("all")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetAllVendorRequests([FromQuery] int page = 1, [FromQuery] int limit = 10)
        {
            if (page < 1 || limit < 1)
                return BadRequest(new { Error = "Page and limit must be greater than 0" });

            var result = await _vendorRequestService.GetAllVendorRequestsAsync(page, limit);

            if (!result.IsSuccess)
                return BadRequest(new { Error = result.Error! });

            return Ok(new { Data = result.Value });
        }

        [HttpPut("approve")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> ApproveVendorRequest([FromHeader]Guid vendorRequestId)
        {
           
            var result = await _vendorRequestService.ApproveVendorRequestAsync(vendorRequestId);

            if (result.IsFailure)
                return BadRequest(new { Error = result.Error! });

            return Ok(new { Message = "Vendor request approved successfully" });
        }

        [HttpPut("reject")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> RejectVendorRequest([FromHeader]Guid vendorRequestId)
        {
         
            var result = await _vendorRequestService.RejectVendorRequestAsync(vendorRequestId);

            if (!result.IsSuccess)
                return BadRequest(new { Error = result.Error! });

            return Ok(new { Message = "Vendor request rejected successfully" });
        }

        private Guid GetUserIdFromClaims()
        {
            var userIdClaim = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            return userIdClaim;
        }
    }
}

