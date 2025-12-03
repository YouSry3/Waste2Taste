using FoodRescue.BLL.DTOs;
using FoodRescue.BLL.Extensions.Users;
using FoodRescue.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Services.UserServices
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;

        public UserService(IUserRepository repo)
        {
            _repo = repo;
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await _repo.GetByIdAsync(id);
        }

        public async Task<User?> GetProfileAsync(string email)
        {
            return await _repo.GetByEmailAsync(email);
        }
        public async Task<IEnumerable<User>> GetVendorsAsync()
        {
            return await _repo.GetVendorsAsync();
        }

        public async Task UpdateProfileAsync(string email, UpdateProfileDTO dto)
        {
            var user = await _repo.GetByEmailAsync(email);
            if (user == null) return;

            user.Name = dto.Name;
            user.Email = dto.Email;
            user.Type = dto.Type;

            await _repo.UpdateAsync(user);
            await _repo.SaveChangesAsync();
        }
    }
}

