using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Contract.DTOs;
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
        Task<Result<User>> GetByIdAsync(Guid id);
        Task<Result<User>> GetProfileAsync(string email);
        Task GetUserStatsAsync(string email);
        Task<Result> UpdateProfileAsync(string email, UpdateProfileDTO dto);

    }
}
