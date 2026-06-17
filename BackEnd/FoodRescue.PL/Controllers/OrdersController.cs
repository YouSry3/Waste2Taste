using FoodRescue.BLL.Contract.Orders.Update;
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


        public OrdersController(IOrderService service, IUserRepository userRepository,IUserRepository userRepository1)
        {
            _orderservice = service;
            _userRepository = userRepository1;
        }

        [HttpPost]

        [Authorize(Roles = "customer")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderRequest order)
        {

            var result = await _orderservice.CreateOrderAsync(order, Guid.Parse(
        User.FindFirst(ClaimTypes.NameIdentifier)!.Value
    ));


            return result.IsSuccess ?
                Ok(result.Value)
                : NotFound(result.Error);
        }

        [HttpGet("my-orders")]
        [Authorize(Roles = "customer")]
        public async Task<IActionResult> GetMyOrders()
        {

            var orders = await _orderservice.GetOrdersByCustomerAsync(Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            ));
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

        [HttpPut("{id:guid}/status")]
        [Authorize(Roles = "admin,vendor")]
        public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] UpdateStatusRequest request)
        {
            if (string.IsNullOrEmpty(request?.Status))
                return BadRequest(new { message = "Status is required." });

            // vendor check stays here (OK)
            //if (User.IsInRole("Vendor") && !User.IsInRole("Admin"))
            {
                var orderCheck = await _orderservice.GetOrderByIdAsync(id);

                if (orderCheck == null)
                    return NotFound();

                var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (!Guid.TryParse(userIdClaim, out Guid vendorId))
                    return Unauthorized();

                if (orderCheck.Product?.VendorId != vendorId)
                    return Forbid();
            }

            var updatedOrder = await _orderservice.UpdateOrderStatusAsync(id, request.Status);

            if (updatedOrder == null)
                return NotFound();

            return Ok(updatedOrder);
        }
        [HttpGet("vendor/orders")]
        [Authorize(Roles = "vendor")]
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
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
                var orders = await _orderservice.GetAllOrdersAsync();
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }


}
