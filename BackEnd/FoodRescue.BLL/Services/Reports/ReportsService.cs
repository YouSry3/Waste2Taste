using FoodRescue.BLL.Contract.Reports.Create;
using FoodRescue.BLL.Contract.Reports.Update;
using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using Microsoft.EntityFrameworkCore;


namespace FoodRescue.BLL.Services.Reports
{
    public class ReportsService(CompanyDbContext context) : IReportsService
    {
        private readonly CompanyDbContext _context = context;



        public async Task<IEnumerable<Report>> ListReportsAsync(Guid userId, bool isAdmin)
        {
            if (isAdmin)
            {
                return await _context.Reports.ToListAsync();
            }
            else
            {
                return await _context.Reports.Where(r => r.UserId == userId).ToListAsync();
            }
        }


        public async Task SubmitReportAsync(ReportRequest reportRequest, Guid userId)
        {
            var report = new Report
            {
                UserId = userId,
                VendorId = reportRequest.VendorId,
                Type = reportRequest.Type,
                Description = reportRequest.Description,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            await _context.Reports.AddAsync(report);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateReportStatusAsync(Guid reportId, ReportStatusRequest statusRequest)
        {
            var report = await _context.Reports.FirstOrDefaultAsync(r => r.Id == reportId);
            if (report == null)
            {
                throw new KeyNotFoundException("Report not found");
            }

            report.Status = statusRequest.NewStatus;
            await _context.SaveChangesAsync();
        }
    }
}
