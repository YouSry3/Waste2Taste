using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Abstractions.TypeErrors
{
    public class DashboardAdminErrors 
    {
        public static Error DashboardLoadFailed => new("Dashboard.LoadFailed", "Failed to load dashboard data.");
        public static Error OverviewLoadFailed => new("Dashboard.OverviewLoadFailed", "Failed to load overview data.");
        public static Error VendorsLoadFailed => new("Dashboard.VendorsLoadFailed", "Failed to load vendors data.");
        public static Error InvalidDashboardParameters => new("Dashboard.InvalidParameters", "Invalid parameters provided for dashboard.");
        public static Error VendorNotFound(Guid vendorId) => new("Dashboard.VendorNotFound", $"Vendor with ID {vendorId} was not found.");
        public static Error UnauthorizedAccess => new("Dashboard.Unauthorized", "You do not have permission to access this dashboard.");
        public static Error UnknownError() => new("Dashboard.UnknownError", $"An unknown error occurred");
        public static Error InvalidPaginationParameters => new("Dashboard.InvalidPagination", "Invalid pagination parameters provided.");
        public static Error InvalidSortingParameters => new("Dashboard.InvalidSorting", "Invalid sorting parameters provided.");
        public static Error InvalidSearchQuery => new("Dashboard.InvalidSearch", "Invalid search query provided.");
        public static Error DataRetrievalFailed() => new("Dashboard.DataRetrievalFailed", $"Failed to retrieve data: ");
        public static Error DataProcessingFailed() => new("Dashboard.DataProcessingFailed", $"Failed to process data");
        public static Error ExternalServiceError(string serviceName, string details) => new("Dashboard.ExternalServiceError", $"External service '{serviceName}' error: {details}");
        public static Error InvalidDateRange => new("Dashboard.InvalidDateRange", "The provided date range is invalid.");
        public static Error NoDataAvailable => new("Dashboard.NoData", "No data available for the specified criteria.");
        public static Error ExportFailed(string details) => new("Dashboard.ExportFailed", $"Failed to export data: {details}");
        public static Error ImportFailed(string details) => new("Dashboard.ImportFailed", $"Failed to import data: {details}");
        public static Error ReportGenerationFailed(string details) => new("Dashboard.ReportGenerationFailed", $"Failed to generate report: {details}");

    }
}
