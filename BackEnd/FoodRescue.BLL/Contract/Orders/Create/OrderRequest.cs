namespace FoodRescue.BLL.Contract.Orders.Create
{
    public class OrderRequest
    {
        public Guid ProductId { get; set; }
        public DateTime PickupTime { get; set; } //  ADDED: Pickup time for the order
    }
}
