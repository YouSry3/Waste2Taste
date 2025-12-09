

namespace FoodRescue.DAL.Entities
{
    public class OrderItem
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }

        // Relations
        public Order Order { get; set; }
        public Product Product { get; set; }
    }

}
