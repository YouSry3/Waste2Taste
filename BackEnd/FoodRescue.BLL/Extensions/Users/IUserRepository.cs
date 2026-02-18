using FoodRescue.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Extensions.Users
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(Guid id);
        Task<bool> IsAdmin(Guid id);
        Task<bool> IsVendor(Guid id);
        Task<bool> IsCustomer(Guid id);
        Task<User?> GetByEmailAsync(string email);
        //Task<IEnumerable<User>> GetVendorsAsync();
        Task UpdateAsync(User user);
        Task SaveChangesAsync();

        bool CheckDuplication(User user, string newPassword);
        //Task<List<Order>> GetUserOrdersAsync(Guid userId);
        Task DeleteAsync(User user);
        //Task CountOrders(Guid userId);


    }


}
