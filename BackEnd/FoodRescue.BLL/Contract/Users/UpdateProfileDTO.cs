using Microsoft.AspNetCore.Http;
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
        public string? FullName { get; set; }
        public IFormFile? Image { get; set; }
    }
}
