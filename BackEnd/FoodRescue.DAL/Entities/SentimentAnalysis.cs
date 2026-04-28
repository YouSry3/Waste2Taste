using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.DAL.Entities
{
    [Table("SentimentAnalysis")]
    public class SentimentAnalysis
    {
        public int Id { get; set; }

        public int ReviewId { get; set; }

        public double Gratitude { get; set; }
        public double Excitement { get; set; }
        public double Urgency { get; set; }

        public bool Neutral { get; set; }

        public DateTime CreatedAt { get; set; }

        // Navigation Property
        public Review Review { get; set; }
    }
}
