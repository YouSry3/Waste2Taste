using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.Listings
{
    public class AISpoilageResponseDto
    {
        public string? Prediction { get; set; }
        public decimal? Confidence { get; set; }
        public int? SpoiledPercentage { get; set; }
        public bool? IsSpoiled { get; set; }
    }

}
