using FoodRescue.BLL.Contract.Reports.Create;
using FoodRescue.BLL.Contract.Reports.Update;
using FoodRescue.DAL.Entities;


namespace FoodRescue.BLL.Services.Reports
{
    public interface IReportsService
    {
        Task SubmitReportAsync(ReportRequest reportRequest, Guid userId);
        Task<IEnumerable<Report>> ListReportsAsync(Guid userId, bool isAdmin);
        Task UpdateReportStatusAsync(Guid reportId, ReportStatusRequest statusRequest);

    }
}
