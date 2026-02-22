namespace FoodRescue.BLL.Contract.AdminDashbord.Users.Response
{
    public class PagedResult<UserListDto>
    {
        public List<UserListDto> Items { get; internal set; }
        public int TotalCount { get; internal set; }
        public int PageSize { get; internal set; }
        public int Page { get; internal set; }
    }
}