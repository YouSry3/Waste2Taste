using FoodRescue.BLL.Contract.Logs;
using FoodRescue.BLL.Services.Logs;
using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using System;

public class ActivityLogService(CompanyDbContext companyDbContext) : IActivityLogService
{
    private readonly CompanyDbContext _db = companyDbContext;

   

    public async Task WriteAsync(CreateActivityLogDto dto, Guid? userId, string? userName)
    {
        var log = new ActivityLog
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Module = dto.Module,
            Action = dto.Action,
            EntityType = dto.EntityType,
            EntityId = dto.EntityId,
            EntityName = dto.EntityName,
            Description = dto.Description,
            OldValue = dto.OldValue,
            NewValue = dto.NewValue,
            Notes = dto.Notes,
            CreatedAt = DateTime.UtcNow
        };

        _db.ActivityLogs.Add(log);
        await _db.SaveChangesAsync();
    }

    public async Task<List<ActivityLogCardDto>> GetAllAsync()
    {
        return await _db.ActivityLogs
            .Include(x => x.User)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new ActivityLogCardDto
            {
                Id = x.Id,
                ActorName = x.User != null ? x.User.Name : "System",
                ActionLabel = x.Action,
                EntityTypeLabel = x.EntityType,

                Title = x.EntityName ?? "-",
                Description = x.Description,

                OldValue = x.OldValue,
                NewValue = x.NewValue,
                Notes = x.Notes,

                CreatedAt = x.CreatedAt,
                CreatedAtFormatted = x.CreatedAt.ToString("MMM dd, yyyy, hh:mm tt"),

                ViewType = x.EntityType.ToLower(),
                ViewId = x.EntityId
            })
            .ToListAsync();
    }

    public async Task<ActivityLogCardDto?> GetByIdAsync(Guid id)
    {
        return await _db.ActivityLogs
            .Include(x => x.User)
            .Where(x => x.Id == id)
            .Select(x => new ActivityLogCardDto
            {
                Id = x.Id,
                ActorName = x.User != null ? x.User.Name : "System",
                ActionLabel = x.Action,
                EntityTypeLabel = x.EntityType,

                Title = x.EntityName ?? "-",
                Description = x.Description,

                OldValue = x.OldValue,
                NewValue = x.NewValue,
                Notes = x.Notes,

                CreatedAt = x.CreatedAt,
                CreatedAtFormatted = x.CreatedAt.ToString("MMM dd, yyyy, hh:mm tt"),

                ViewType = x.EntityType.ToLower(),
                ViewId = x.EntityId
            })
            .FirstOrDefaultAsync();
    }
}