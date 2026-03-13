using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.Listings
{
    public class ListingsPindingResponse
    {
        public Guid ProductId { get; set; }
        public Guid VendorId { get; set; }

        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string? Category { get; set; }

        public string ImageUrl { get; set; } = null!;
        public decimal Price { get; set; }
        public decimal OriginalPrice { get; set; }
        public int Quantity { get; set; }

        public DateTime ExpiryDate { get; set; }
        public DateTime CreatedAt { get; set; }

        public AISpoilageResponseDto? AI { get; set; }
    }
}
