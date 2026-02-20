namespace FoodRescue.BLL.Contract.Orders.Create
{
    public class OrderResponse
    {
        public Guid Id { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }


        public DateTime PickupTime { get; set; } //  ADDED: Pickup time in response

        public string ProductName { get; set; }
    }
}
