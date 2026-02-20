using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Contract.DTOs;
using FoodRescue.BLL.Contract.Users;
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
        Task<Result<UserInfoResponse>> GetProfileAsync(Guid userId);
        //Task GetUserStatsAsync(string email);
        Task<Result> UpdateProfileAsync(Guid userId, UpdateProfileDTO dto);
        Task<Result> ChangePasswordAsync(Guid userId, ChangePassword dto);
        Task<Result> DeleteUserAsync(Guid userId);

    }
}
