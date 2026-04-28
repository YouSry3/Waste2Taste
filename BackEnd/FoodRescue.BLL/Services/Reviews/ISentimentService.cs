using FoodRescue.BLL.Contract.Reviews;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Services.Reviews
{
    public interface ISentimentService
    {
        Task<SentimentResponse> AnalyzeText(string text);

    }
}
