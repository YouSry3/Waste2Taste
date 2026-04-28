using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.Logs
{
    public class ActivityLogCardDto
    {
        public Guid Id { get; set; }

        public string ActorName { get; set; } = null!;
        public string ActionLabel { get; set; } = null!;
        public string EntityTypeLabel { get; set; } = null!;

        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;

        public string? OldValue { get; set; }
        public string? NewValue { get; set; }

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; }
        public string CreatedAtFormatted { get; set; } = null!;

        public string ViewType { get; set; } = null!;
        public Guid? ViewId { get; set; }
    }
}
