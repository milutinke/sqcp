namespace SQCP.DataAccess.Pagination;

public record PaginationRequest(int Page, int PageSize = 25);