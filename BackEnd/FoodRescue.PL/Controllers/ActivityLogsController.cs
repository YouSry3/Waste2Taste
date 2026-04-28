using FoodRescue.BLL.Services.Logs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("Logs")]
[Authorize(Roles = "admin")]
public class ActivityLogsController : ControllerBase
{
    private readonly IActivityLogService _logService;

    public ActivityLogsController(IActivityLogService logService)
    {
        _logService = logService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var data = await _logService.GetAllAsync();
        return Ok(data);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var data = await _logService.GetByIdAsync(id);

        if (data == null)
            return NotFound();

        return Ok(data);
    }
}