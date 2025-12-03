using FoodRescue.BLL.DTOs;
using FoodRescue.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Services.UserServices
{
    public interface IUserService
    {
        Task<User?> GetByIdAsync(Guid id);
        Task<User?> GetProfileAsync(string email);
        Task<IEnumerable<User>> GetVendorsAsync();
        Task UpdateProfileAsync(string email, UpdateProfileDTO dto);
    }
}
