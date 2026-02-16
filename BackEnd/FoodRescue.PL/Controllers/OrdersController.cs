using FoodRescue.BLL.Contract.Orders.Create;
using FoodRescue.BLL.Extensions.Users;
using FoodRescue.BLL.Services.Orders;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodRescue.PL.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderservice;
        private readonly IUserRepository _userRepository;

        public OrdersController(IOrderService service, IUserRepository userRepository)
        {
            _orderservice = service;
            _userRepository = userRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderRequest order)
        {
            var userId = Guid.Parse(
        User.FindFirst(ClaimTypes.NameIdentifier)!.Value
    );

            var isCustomer = await _userRepository.IsCustomer(userId);

            var result = await _orderservice.CreateOrderAsync(order, userId);

            return result.IsSuccess ?
                Ok(result.Value)
                : NotFound(result.Error);
        }

        [HttpGet("my-orders")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetMyOrders()
        {
            Guid userId = Guid.Parse(
           User.FindFirst(ClaimTypes.NameIdentifier)!.Value
       );
            var isCustomer = await _userRepository.IsCustomer(userId);

            if (!isCustomer)
            {
                return Unauthorized("Invalid user ID.");
            }

            var orders = await _orderservice.GetOrdersByCustomerAsync(userId);
            return Ok(orders);
        }





        // FIXED: Changed int to Guid, added :guid constraint
        [HttpGet("{id:guid}")]
        [Authorize]
        public async Task<IActionResult> GetOrderById(Guid id)
        {
            try
            {
                var order = await _orderservice.GetOrderByIdAsync(id);

                if (order == null)
                {
                    return NotFound(new { message = "Order not found." });
                }

                // Authorization check
                var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var isAdmin = User.IsInRole("Admin");

                if (!Guid.TryParse(userIdClaim, out Guid userId))
                {
                    return Unauthorized("Invalid user ID.");
                }

                bool isAuthorized = isAdmin ||
                                  order.CustomerId == userId ||
                                  order.Product?.VendorId == userId;

                if (!isAuthorized)
                {
                    return Forbid();
                }

                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // FIXED: Changed int to Guid, added :guid constraint
        [HttpPut("{id:guid}/status")]
        [Authorize(Roles = "Vendor,Admin")]
        public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] UpdateStatusRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request?.Status))
                {
                    return BadRequest(new { message = "Status is required." });
                }

                // Optional: Check if vendor owns the product in the order
                if (User.IsInRole("Vendor") && !User.IsInRole("Admin"))
                {
                    var order = await _orderservice.GetOrderByIdAsync(id);

                    if (order == null)
                    {
                        return NotFound(new { message = "Order not found." });
                    }

                    var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

                    if (!Guid.TryParse(userIdClaim, out Guid vendorId))
                    {
                        return Unauthorized("Invalid user ID.");
                    }

                    if (order.Product?.VendorId != vendorId)
                    {
                        return Forbid();
                    }
                }

                var updatedOrder = await _orderservice.UpdateOrderStatusAsync(id, request.Status);

                if (updatedOrder == null)
                {
                    return NotFound(new { message = "Order not found." });
                }

                return Ok(updatedOrder);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("vendor/orders")]
        [Authorize(Roles = "Vendor")]
        public async Task<IActionResult> GetVendorOrders()
        {
            try
            {
                var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid vendorId))
                {
                    return Unauthorized("Invalid user ID.");
                }

                var orders = await _orderservice.GetOrdersByVendorAsync(vendorId);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
                // يمكنك إضافة method جديدة في Service للـ Admin
                // var orders = await _service.GetAllOrdersAsync();
                return Ok(new { message = "This endpoint needs implementation in service layer." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

    // DTO for UpdateStatus
    public class UpdateStatusRequest
    {
        public string Status { get; set; }
    }
}
