using System.Linq.Expressions;
using SQCP.DataAccess.Pagination;

namespace SQCP.DataAccess.Contracts;

public interface IGenericRepository<T> where T : class
{
    Task<object> GetAllAsync(
        Expression<Func<T, bool>>? expression = null,
        Func<IQueryable<T>, IQueryable<T>>? orderBy = null,
        List<string>? include = null,
        PaginationRequest? pageRequest = null
    );

    Task<T?>? GetAsync(Expression<Func<T, bool>> expression, List<string>? include = null);

    Task InsertAsync(T entity);

    Task InsertRangeAsync(IEnumerable<T> entities);

    Task DeleteAsync(int id);

    void DeleteRange(IEnumerable<T> entities);

    void Update(T entity);
}