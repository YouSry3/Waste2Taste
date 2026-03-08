using FoodRescue.DAL.Consts;
using Microsoft.AspNetCore.Http;

namespace FoodRescue.BLL.Contract.VendorDashboard;
public class VendorDataRequest
{
    public string Name { get; set; } = null!;
    public VendorCategory Category { get; set; }
    public string Email { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public string Address { get; set; } = null!;

    // File uploads (not stored in DB, handled separately)
    public IFormFile? BusinessLicenseFile { get; set; }
    public IFormFile? HealthCertificateFile { get; set; }

    // URLs returned from service (stored in DB)
    public string? BusinessLicenseUrl { get; set; }
    public string? HealthCertificateUrl { get; set; }
}

