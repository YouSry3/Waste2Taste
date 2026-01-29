using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodRescue.PL.Controllers
{
    [ApiController]
    [Route("orders")]
    public class OrdersController : ControllerBase
    {
        // POST /orders
        [HttpPost]
        [Authorize(Roles = "Customer")]
        public IActionResult CreateOrder()
        {
            return Ok("Order created");
        }

        // GET /orders
        [HttpGet]
        [Authorize(Roles = "Customer")]
        public IActionResult GetMyOrders()
        {
            return Ok("My orders");
        }
        // GET /orders/{id}
        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetOrderById(int id)
        {
            return Ok($"Order {id}");
        }

        // PUT /orders/{id}/status
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Vendor,Admin")]
        public IActionResult UpdateOrderStatus(int id)
        {
            return Ok($"Order {id} status updated");
        }
        // GET /vendors/orders
        [HttpGet("/vendors/orders")]
        [Authorize(Roles = "Vendor")]
        public IActionResult GetVendorOrders()
        {
            return Ok("Vendor orders");
        }
    }
}
