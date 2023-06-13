namespace SQCP.DataAccess.Pagination;

public class PaginatedResult<T>
{
    public long TotalItems { get; set; }
    public int CurrentPage { get; set; }
    public int? NextPage { get; set; }
    public int? PreviousPage { get; set; }
    public int TotalPages { get; set; }
    public IList<T>? Results { get; set; }
}