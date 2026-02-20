namespace FoodRescue.DAL.Entities
{
    public class Order
    {
        public Guid Id { get; set; }              //  FIXED: Guid instead of int

        public Guid CustomerId { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; } = DateTime.Now;


        // For Dashboard
        public DateTime PickupTime { get; set; }



        public Guid ProductId { get; set; }       //  FIXED: Typo "ProuductId" → "ProductId"

        public User Customer { get; set; } = null!;
        public Product Product { get; set; } = null!;
    }
}
