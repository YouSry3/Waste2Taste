using FoodRescue.BLL.Services.Orders;
using FoodRescue.DAL.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodRescue.PL.Controllers
{
    [ApiController]
    [Route("orders")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _service;

        public OrdersController(IOrderService service)
        {
            _service = service;
        }

        [HttpPost]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            var created = await _service.CreateOrderAsync(order);
            return Ok(created);
        }

        [HttpGet]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = User.Identity.Name;
            var orders = await _service.GetOrdersByCustomerAsync(userId);
            return Ok(orders);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var userId = User.Identity.Name;
            var role = User.IsInRole("Admin") ? "Admin" : null;

            try
            {
                var order = await _service.GetOrderByIdAsync(id, userId, role);
                return Ok(order);
            }
            catch
            {
                return Forbid();
            }
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Vendor,Admin")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string status)
        {
            var order = await _service.UpdateOrderStatusAsync(id, status);
            return Ok(order);
        }

        [HttpGet("/vendors/orders")]
        [Authorize(Roles = "Vendor")]
        public async Task<IActionResult> GetVendorOrders()
        {
            var vendorId = User.Identity.Name;
            var orders = await _service.GetOrdersByVendorAsync(vendorId);
            return Ok(orders);
        }
    }
}
