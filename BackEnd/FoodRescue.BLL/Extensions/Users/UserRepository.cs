using FluentEmail.Core;
using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Extensions.Users
{
    public class UserRepository : IUserRepository
    {
        private readonly CompanyDbContext _context;

        public UserRepository(CompanyDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<IEnumerable<User>> GetVendorsAsync()
        {
            return await _context.Users
                .Where(u => u.Type.ToLower() == "vendor")
                .ToListAsync();
        }

        public async Task UpdateAsync(User user)
        {
            _context.Users.Update(user);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        // تنفيذ الدالة
        public bool CheckDuplication(User user, string newPassword)
        {
            return user.Password == newPassword;
        }

        public async Task<bool> IsAdmin(Guid id)
        {
            var Result = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (Result != null && Result.Type.ToLower() == "admin")
            
                return true;

            return false;
        }

        public async Task<bool> IsVendor(Guid id)
        {
            var Result = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (Result != null && Result.Type.ToLower() == "vendor")

                return true;

            return false;
        }

        public async Task<bool> IsCustomer(Guid id)
        {
            var Result = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (Result is not null && Result.Type.ToLower() == "customer")

                return true;

            return false;
        }
    }

}
