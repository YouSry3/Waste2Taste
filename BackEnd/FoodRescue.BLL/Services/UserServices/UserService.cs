using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Abstractions.TypeErrors;
using FoodRescue.BLL.Contract.DTOs;
using FoodRescue.BLL.Extensions.Users;
using FoodRescue.BLL.Extensions.Vendors;
using FoodRescue.DAL.Entities;


namespace FoodRescue.BLL.Services.UserServices
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;
       

        public UserService(IUserRepository repo)
        {
            _repo = repo;
            
        }
        

        public async Task<Result<User>> GetByIdAsync(Guid id)
        {
            var IsExited = await _repo.GetByIdAsync(id);
            // Handeling Error If User Not Existed
            return IsExited == null 
                ? Result.Failure<User>(UserErrors.EmailUndefinded)
                : Result.Success<User>(IsExited);


        }

        public async Task<Result<User>> GetProfileAsync(string email)
        {
            var IsExited = await _repo.GetByEmailAsync(email);
            // Handeling Error If User Not Existed
            return IsExited == null
                ? Result.Failure<User>(UserErrors.EmailUndefinded)
                : Result.Success<User>(IsExited);
        }


        public async Task<Result> UpdateProfileAsync(string email, UpdateProfileDTO dto)
        {
            var user = await _repo.GetByEmailAsync(email);

            if (user == null)
                return Result.Failure(UserErrors.EmailUndefinded);

            user.Name = dto.Name;
            user.Type = dto.Type;

            if (!string.IsNullOrEmpty(dto.ProfileImage))
                user.ProfileImage = dto.ProfileImage;  

            await _repo.UpdateAsync(user);
            await _repo.SaveChangesAsync();

            return Result.Success();
        }


        public async Task<Result<UserStats>> GetUserStatsAsync(string email)
        {
            var userResult = await GetProfileAsync(email);
            if (userResult.IsFailure)
                return Result.Failure<UserStats>(userResult.Error);

            var userId = userResult.Value.Id;

            var orders = await _repo.GetUserOrdersAsync(userId);

            var stats = new UserStats
            {
                Orders = orders?.Count ?? 0,
                MoneySpent = orders?.Sum(o => o.TotalPrice) ?? 0,
                MoneySaved = orders?.Sum(o => o.Discount) ?? 0
            };

            return Result.Success(stats);
        }

    }
}

