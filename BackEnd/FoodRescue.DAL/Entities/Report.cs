using FoodRescue.DAL.Consts;
using System;

namespace FoodRescue.DAL.Entities
{
    public class Report
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid ProductId { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public ReportPriority Priority { get; set; } = ReportPriority.Medium;
        public DateTime CreatedAt { get; set; }

        // Relations
        public User User { get; set; }
        public Product Product { get; set; }
    }
}