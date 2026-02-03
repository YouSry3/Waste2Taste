using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Abstractions.TypeErrors;
using FoodRescue.BLL.Contract.DTOs;
using FoodRescue.BLL.Contract.Users;
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

        public async Task<Result<UserInfoResponse>> GetProfileAsync(Guid userId)
        {
            if(!await _repo.IsCustomer(userId))
                return Result.Failure<UserInfoResponse>(UserErrors.OnlyCustomersCanAccessProfile(userId));

            var IsExited = await _repo.GetByIdAsync(userId);

            var response = new UserInfoResponse
            {
                Name = IsExited.Name,
                Email = IsExited.Email,
                //ProfileImage = IsExited.ProfileImage,
                Type = IsExited.Type,
                OrderCount = (await _repo.GetUserOrdersAsync(userId))?.Count ?? 1,
                MoneySpent = (await _repo.GetUserOrdersAsync(userId))?.Sum(o => o.TotalPrice) ?? 1,
                moneySaved = (await _repo.GetUserOrdersAsync(userId))?.Sum(o => o.Discount) ?? 1 // To Test because there is no orders yet
            };


            // Handeling Error If User Not Existed
            return IsExited == null
                ? Result.Failure<UserInfoResponse>(UserErrors.EmailUndefinded)
                : Result.Success(response);
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


        //public async Task<Result<UserStats>> GetUserStatsAsync(string email)
        //{
        //    var userResult = await GetProfileAsync(email);
        //    if (userResult.IsFailure)
        //        return Result.Failure<UserStats>(UserErrors.EmailUndefinded);

        //    var userId = userResult.Value.Id;

        //    var orders = await _repo.GetUserOrdersAsync(userId);

        //    var stats = new UserStats
        //    {
        //        Orders = orders?.Count ?? 0,
        //        MoneySpent = orders?.Sum(o => o.TotalPrice) ?? 0,
        //        MoneySaved = orders?.Sum(o => o.Discount) ?? 0
        //    };

        //    return Result.Success(stats);
        //}
        public async Task<Result> ChangePasswordAsync(Guid userId, ChangePassword dto)
        {
            if(!await _repo.IsCustomer(userId))
                return Result.Failure(UserErrors.OnlyCustomersCanChangePassword(userId));
            var user = await _repo.GetByIdAsync(userId);
            if (user == null)
                return Result.Failure(UserErrors.EmailUndefinded);

            if (!_repo.CheckDuplication(user, dto.OldPassword))
                return Result.Failure(UserErrors.DuplicationPassword);

            user.Password = dto.NewPassword;

            await _repo.UpdateAsync(user);
            await _repo.SaveChangesAsync();

            return Result.Success();
        }

        //Task IUserService.GetUserStatsAsync(string email)
        //{
        //    return GetUserStatsAsync(email);
        //}

        public async Task<Result> DeleteUserAsync(Guid userId)
        {
            if (!await _repo.IsCustomer(userId))
                return Result.Failure(UserErrors.OnlyCustomersCanChangePassword(userId));
            var user = await _repo.GetByIdAsync(userId);
            if (user == null)
                return Result.Failure(UserErrors.EmailUndefinded);
            
            await _repo.DeleteAsync(user);


            return Result.Success();
        }
    }
}

