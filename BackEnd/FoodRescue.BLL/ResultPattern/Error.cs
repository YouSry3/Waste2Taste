using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.ResultPattern
{
    public record Error(string code, string description)
    {
        public static Error None => new(string.Empty, string.Empty);

    }
}
