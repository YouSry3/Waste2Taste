using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace FoodRescue.BLL.Extensions.Reports
{
    public class ReportRepository(CompanyDbContext context) : IReportRepository
    {
        private readonly CompanyDbContext _context = context;

        // Report Operations
        public async Task<Report?> GetByIdAsync(Guid id)
        {
            return await _context.Reports
                .Include(r => r.User)
                .Include(r => r.Product)
                .Include(r => r.Order)
                .Include(r => r.Responses)
                    .ThenInclude(rr => rr.Responder)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<IEnumerable<Report>> GetAllAsync()
        {
            return await _context.Reports
                .Include(r => r.User)
                .Include(r => r.Product)
                .Include(r => r.Responses)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Report>> GetByStatusAsync(string status)
        {
            return await _context.Reports
                .Include(r => r.User)
                .Include(r => r.Product)
                .Include(r => r.Responses)
                .Where(r => r.Status == status)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Report>> GetByUserIdAsync(Guid userId)
        {
            return await _context.Reports
                .Include(r => r.User)
                .Include(r => r.Product)
                .Include(r => r.Responses)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Report>> SearchAsync(string? customerName = null, Guid? orderId = null, string? listingName = null)
        {
            var query = _context.Reports
                .Include(r => r.User)
                .Include(r => r.Product)
                .Include(r => r.Responses)
                .AsQueryable();

            if (!string.IsNullOrEmpty(customerName))
                query = query.Where(r => r.CustomerName.Contains(customerName));

            if (orderId.HasValue)
                query = query.Where(r => r.OrderId == orderId);

            if (!string.IsNullOrEmpty(listingName))
                query = query.Where(r => r.ListingName.Contains(listingName));

            return await query.OrderByDescending(r => r.CreatedAt).ToListAsync();
        }

        public async Task<IEnumerable<Report>> GetFilteredAsync(string? status = null, string? priority = null, string? search = null)
        {
            var query = _context.Reports
                .Include(r => r.User)
                .Include(r => r.Product)
                .Include(r => r.Responses)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(r => r.Status == status);

            if (!string.IsNullOrEmpty(priority))
                query = query.Where(r => r.Priority.ToString() == priority);

            if (!string.IsNullOrEmpty(search))
                query = query.Where(r =>
                    r.CustomerName.Contains(search) ||
                    r.ReportCode.Contains(search) ||
                    r.ListingName.Contains(search) ||
                    r.Description.Contains(search));

            return await query.OrderByDescending(r => r.CreatedAt).ToListAsync();
        }

        public async Task AddAsync(Report report)
        {
            await _context.Reports.AddAsync(report);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Report report)
        {
            report.UpdatedAt = DateTime.UtcNow;
            _context.Reports.Update(report);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var report = await _context.Reports.FindAsync(id);
            if (report != null)
            {
                _context.Reports.Remove(report);
                await _context.SaveChangesAsync();
            }
        }

        // Report Response Operations
        public async Task<ReportResponse?> GetResponseByIdAsync(Guid id)
        {
            return await _context.ReportResponses
                .Include(rr => rr.Responder)
                .FirstOrDefaultAsync(rr => rr.Id == id);
        }

        public async Task<IEnumerable<ReportResponse>> GetResponsesByReportIdAsync(Guid reportId)
        {
            return await _context.ReportResponses
                .Include(rr => rr.Responder)
                .Where(rr => rr.ReportId == reportId)
                .OrderByDescending(rr => rr.CreatedAt)
                .ToListAsync();
        }

        public async Task AddResponseAsync(ReportResponse response)
        {
            await _context.ReportResponses.AddAsync(response);
            await _context.SaveChangesAsync();
        }

        // Stats Operations
        public async Task<int> GetTotalReportsAsync()
        {
            return await _context.Reports.CountAsync();
        }

        public async Task<int> GetReportCountByStatusAsync(string status)
        {
            return await _context.Reports.CountAsync(r => r.Status == status);
        }

        public async Task<int> GetReportCountByPriorityAsync(string priority)
        {
            return await _context.Reports.CountAsync(r => r.Priority.ToString() == priority);
        }

        public async Task<decimal> GetTotalRefundAmountAsync()
        {
            return await _context.Reports.SumAsync(r => r.RefundAmount);
        }

        public async Task<string> GenerateReportCodeAsync()
        {
            var lastReport = await _context.Reports
                .OrderByDescending(r => r.CreatedAt)
                .FirstOrDefaultAsync();

            if (lastReport == null || string.IsNullOrEmpty(lastReport.ReportCode))
                return "REP-001";

            // Extract number from code like "REP-001"
            var numberPart = lastReport.ReportCode.Split('-')[1];
            if (int.TryParse(numberPart, out int number))
            {
                return $"REP-{(number + 1):D3}";
            }

            return "REP-001";
        }
    }
}
