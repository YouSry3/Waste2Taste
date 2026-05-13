namespace FoodRescue.BLL.Contract.Orders.info
{
    public class CustomerOrderDto
    {
        public string OrderNumber { get; set; } = null!;
        public Guid OrderId { get; set; }
        public string Status { get; set; } = null!;
        public string ProductName { get; set; } = null!;
        public Guid VendorId { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string VendorName { get; set; } = null!;
        public string ImageUrl { get; set; } = null!;

        public decimal Price { get; set; }

        public DateTime PickupTime { get; set; }
    }
}
