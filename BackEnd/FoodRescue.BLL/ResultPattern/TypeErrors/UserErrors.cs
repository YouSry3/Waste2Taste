using FoodRescue.BLL.ResultPattern;

namespace FoodRescue.BLL.ResultPattern.TypeErrors
{
    public class UserErrors
    {
        public static Error EmailUndefinded => new("User.EmailUndefined", "The user email is undefined.");
        public static Error EmailIsExisted => new("User.EmailIsExisted", "The user email is already Existed.");
        public static Error InValidCredentials => new("User.InValidCredentials", "The user credentials(Email | Password) are invalid.");
        public static Error InValidToken => new("User.InValidToken", "The user token is invalid.");
        public static Error InValidCode => new("User.InValidCode", "The user code is invalid.");

        public static Error DuplicationPassword => new("User.DuplicationPassword", "The new password cannot be the same as the old password.");
        public static Error InValidIdentifier => new("User.InValidIdentifier", "The user identifier is invalid.");

        public static Error OnlyCustomerAccess => new("User.OnlyCustomerAccess", "Only customers can Access this Service.");

        public static Error OnlyCustomersCanChangePassword(Guid userId) =>
            new("User.OnlyCustomersCanChangePassword", $"Only customers can change their password. UserId: {userId}");
        public static Error OnlyCustomersCanAccessProfile(Guid userId)=>
            new("User.OnlyCustomersCanAccessProfile", $"Only customers can access their profile. UserId: {userId}");

    }
}
