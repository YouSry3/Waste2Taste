namespace FoodRescue.DAL.Entities;

public class AISpoileRequest
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string Prediction { get; set; } = null!;
    public decimal Confidence { get; set; }
    public int SpoiledPercentage { get; set; }
    public bool IsSpoiled { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation
    public Product Product { get; set; } = null!;
}
