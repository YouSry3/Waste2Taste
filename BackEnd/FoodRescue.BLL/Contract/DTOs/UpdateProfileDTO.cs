using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.DTOs
{
    public class UpdateProfileDTO
    {
        
        [Required(ErrorMessage = "Name is required.")]
        [MinLength(3, ErrorMessage = "Name must be at least 3 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; } = string.Empty;

        
        [Required(ErrorMessage = "Type is required.")]
        [RegularExpression("admin|vendor|customer",
            ErrorMessage = "Type must be admin, vendor, or customer.")]
        public string Type { get; set; } = string.Empty;
    }
}
