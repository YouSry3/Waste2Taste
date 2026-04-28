using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.Reviews
{
    public class SentimentResponse
    {
        public Dictionary<string, double> Tags { get; set; }
        public bool Neutral { get; set; }
    }
}
