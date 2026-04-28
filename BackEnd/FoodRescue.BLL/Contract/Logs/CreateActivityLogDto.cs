using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.Logs
{
    public class CreateActivityLogDto
    {
        public string Module { get; set; } = null!;
        public string Action { get; set; } = null!;
        public string EntityType { get; set; } = null!;
        public Guid? EntityId { get; set; }

        public string? EntityName { get; set; }
        public string Description { get; set; } = null!;

        public string? OldValue { get; set; }
        public string? NewValue { get; set; }

        public string? Notes { get; set; }
    }
}
