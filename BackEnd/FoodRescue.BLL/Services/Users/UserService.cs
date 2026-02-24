using FoodRescue.BLL.ResultPattern;
using FoodRescue.BLL.Contract.DTOs;
using FoodRescue.BLL.Contract.Users;
using FoodRescue.BLL.Extensions.Users;
using FoodRescue.BLL.Extensions.Vendors;
using FoodRescue.BLL.ResultPattern.TypeErrors;
using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using Mapster;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;


namespace FoodRescue.BLL.Services.UserServices
{
    public class UserService(IUserRepository repository, CompanyDbContext context, IWebHostEnvironment environment) : IUserService
    {
        private readonly IUserRepository _userRepo = repository;
        private readonly CompanyDbContext _context = context;
        private readonly IWebHostEnvironment _environment = environment;

        public async Task<Result<User>> GetByIdAsync(Guid id)
        {
            var IsExited = await _userRepo.GetByIdAsync(id);
            // Handeling Error If User Not Existed
            return IsExited == null 
                ? Result.Failure<User>(UserErrors.EmailUndefinded)
                : Result.Success<User>(IsExited);


        }

        public async Task<Result<UserInfoResponse>> GetProfileAsync(Guid userId)
        {
            if(!await _userRepo.IsCustomer(userId))
                return Result.Failure<UserInfoResponse>(UserErrors.OnlyCustomersCanAccessProfile(userId));

            var IsExited = await _userRepo.GetByIdAsync(userId);
            if (IsExited == null)
                return Result.Failure<UserInfoResponse>(UserErrors.EmailUndefinded);
                
            var orders = await _userRepo.GetUserOrdersAsync(userId);
            Decimal totalPaid = orders.Sum(o => o.TotalPrice);
            Decimal totalOriginal = orders.Sum(o => o.Product.OriginalPrice);

            var response = IsExited.Adapt<UserInfoResponse>();


            response.OrderCount = orders?.Count ?? 0;
            response.MoneySpent = totalPaid > 0 ? totalPaid : 1;//write "1" to show the money saved if the user didn't buy any thing
            response.moneySaved = (totalOriginal - totalPaid) > 0 ? (totalOriginal - totalPaid) : 1;//write "1" to show the money saved if the user didn't buy any thing
          


            // Handeling Error If User Not Existed
            return Result.Success(response);
        }


        public async Task<Result> UpdateProfileAsync(Guid userId, UpdateProfileDTO dto)
        {
            var user = await _userRepo.GetByIdAsync(userId);

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
            if(!await _userRepo.IsCustomer(userId))
                return Result.Failure(UserErrors.OnlyCustomersCanChangePassword(userId));
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null)
                return Result.Failure(UserErrors.EmailUndefinded);

            if (!_userRepo.CheckDuplication(user, dto.OldPassword))
                return Result.Failure(UserErrors.DuplicationPassword);

            user.Password = dto.NewPassword;

            await _userRepo.UpdateAsync(user);
            await _userRepo.SaveChangesAsync();

            return Result.Success();
        }

        //Task IUserService.GetUserStatsAsync(string email)
        //{
        //    return GetUserStatsAsync(email);
        //}

        public async Task<Result> DeleteUserAsync(Guid userId)
        {
            if (!await _userRepo.IsCustomer(userId))
                return Result.Failure(UserErrors.OnlyCustomersCanChangePassword(userId));
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null)
                return Result.Failure(UserErrors.EmailUndefinded);
            
            await _userRepo.DeleteAsync(user);


            return Result.Success();
        }
    }
}

