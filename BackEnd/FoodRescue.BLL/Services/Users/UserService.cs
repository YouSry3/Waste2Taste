using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Abstractions.TypeErrors;
using FoodRescue.BLL.Contract.DTOs;
using FoodRescue.BLL.Contract.Users;
using FoodRescue.BLL.Extensions.Users;
using FoodRescue.BLL.Extensions.Vendors;
using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;


namespace FoodRescue.BLL.Services.UserServices
{
    public class UserService(IUserRepository repository, CompanyDbContext context, IWebHostEnvironment environment) : IUserService
    {
        private readonly IUserRepository _repo = repository;
        private readonly CompanyDbContext _context = context;
        private readonly IWebHostEnvironment _environment = environment;

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
                ProfileImage = IsExited.ImageUrl,
                Type = IsExited.Type,
                OrderCount = 0,//(await _repo.GetUserOrdersAsync(userId))?.Count ?? 1,
                MoneySpent =0, //(await _repo.GetUserOrdersAsync(userId))?.Sum(o => o.TotalPrice) ?? 1,
                moneySaved = 0,//(await _repo.GetUserOrdersAsync(userId))?.Sum(o => o.Discount) ?? 1 // To Test because there is no orders yet
            };


            // Handeling Error If User Not Existed
            return IsExited == null
                ? Result.Failure<UserInfoResponse>(UserErrors.EmailUndefinded)
                : Result.Success(response);
        }


        public async Task<Result> UpdateProfileAsync(string email, UpdateProfileDTO dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                return Result.Failure(UserErrors.EmailUndefinded);

            // Update Full Name
            if (!string.IsNullOrWhiteSpace(dto.FullName))
                user.Name = dto.FullName;

            // Update Image
            if (dto.Image != null && dto.Image.Length > 0)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(dto.Image.FileName);

                var filePath = Path.Combine(_environment.WebRootPath, "images", fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await dto.Image.CopyToAsync(stream);

                user.ImageUrl = "/images/" + fileName;
            }

            await _context.SaveChangesAsync();

            return Result.Success();
        }



       
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

