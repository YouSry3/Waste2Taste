using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Services.JWT
{
    public class JwtOptions
    {
        public static string SectionName = "Jwt";
        [Required]
        public string Key { get; init; } = string.Empty;
        [Required]
        public string Issuer { get; init; } = string.Empty;
        [Required]
        public string Audience { get; init; } = string.Empty;
        [Required]
        [Range(1, int.MaxValue)]
        public int ExpiryMinutes { get; init; }
    }
}
