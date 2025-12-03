

namespace FoodRescue.PL.Abstractions.TypeErrors
{
    public class UserErrors
    {
        public static Error EmailIsExisted => new("User.EmailIsExisted", "The user email is already Existed.");
        public static Error InValidCredentials => new("User.InValidCredentials", "The user credentials(Email | Password) are invalid.");
        public static Error InValidToken => new("User.InValidToken", "The user token is invalid.");
        public static Error InValidIdentifier => new("User.InValidIdentifier", "The user identifier is invalid.");

    }
}
