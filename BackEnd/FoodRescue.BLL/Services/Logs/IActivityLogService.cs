using FoodRescue.BLL.Contract.Logs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Services.Logs
{
    public interface IActivityLogService
    {
        Task WriteAsync(CreateActivityLogDto dto, Guid? userId, string? userName);
        Task<List<ActivityLogCardDto>> GetAllAsync();
        Task<ActivityLogCardDto?> GetByIdAsync(Guid id);
    }
}
