using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.Reviews
{
    public class ReviewWithSentimentResponse
    {
        public int Id { get; set; }
        public string Comment { get; set; }
        public decimal Rating { get; set; }

        public InfoUser User { get; set; }
        public DateTime CreatedAt { get; set; }

        public SentimentDto Sentiment { get; set; }
    }
    public class SentimentDto
    {
        public double Gratitude { get; set; }
        public double Excitement { get; set; }
        public double Urgency { get; set; }
        public bool Neutral { get; set; }
    }
}
