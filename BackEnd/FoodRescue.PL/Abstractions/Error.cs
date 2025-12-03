
namespace FoodRescue.PL.Abstractions
{
    public record Error(string code, string description)
    {
        public static Error None => new(string.Empty, string.Empty);

    }
}
