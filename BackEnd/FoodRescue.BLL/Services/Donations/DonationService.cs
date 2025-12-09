using FoodRescue.BLL.Contract.Donations;
using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Services.Donations
{
    public class DonationService(CompanyDbContext context) : IDonationService
    {
        private readonly CompanyDbContext _context = context;

        public async Task<DonationResponse> CreateDonationAsync(Guid vendorId, DonationRequest request)
        {
            var donation = new Donation
            {
                Id = Guid.NewGuid(),
                VendorId = vendorId,
                Quantity = request.Quantity,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.Donations.Add(donation);
            await _context.SaveChangesAsync();

            return new DonationResponse
            {
                Id = donation.Id,
                Quantity = donation.Quantity,
                Status = donation.Status,
                CreatedAt = donation.CreatedAt
            };
        }

        public async Task<IEnumerable<DonationResponse>> GetAllDonationsAsync()
        {
            return await _context.Donations
                .Select(d => new DonationResponse
                {
                    Id = d.Id,
                    Quantity = d.Quantity,
                    Status = d.Status,
                    CreatedAt = d.CreatedAt
                })
                .ToListAsync();
        }


        public async Task<IEnumerable<DonationResponse>> GetDonationsByVendorAsync(Guid vendorId)
        {
            return await _context.Donations
                .Where(d => d.VendorId == vendorId)
                .Select(d => new DonationResponse
                {
                    Id = d.Id,
                    Quantity = d.Quantity,
                    Status = d.Status,
                    CreatedAt = d.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<bool> UpdateDonationStatusAsync(Guid donationId, string status)
        {
            var donation = await _context.Donations.FindAsync(donationId);
            if (donation == null) return false;

            donation.Status = status;
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
