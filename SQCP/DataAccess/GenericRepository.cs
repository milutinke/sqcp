using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using SQCP.DataAccess.Contracts;
using SQCP.DataAccess.Pagination;

namespace SQCP.DataAccess;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    private readonly DatabaseContext? _context;
    private readonly DbSet<T>? _db;

    public GenericRepository(DatabaseContext context)
    {
        _context = context;
        _db = _context.Set<T>();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _db!.FindAsync(id);

        if (entity != null)
            _db!.Remove(entity);
    }

    public void DeleteRange(IEnumerable<T> entities)
    {
        _db!.RemoveRange(entities);
    }

    public async Task<T?>? GetAsync(Expression<Func<T, bool>> expression, List<string>? includes = null)
    {
        IQueryable<T> query = _db!;

        if (includes != null)
            query = includes.Aggregate(query, (current, includeProperty) => current.Include(includeProperty));

        return await query!.AsNoTracking().FirstOrDefaultAsync(expression);
    }

    public async Task<object> GetAllAsync(Expression<Func<T, bool>>? expression = null,
        Func<IQueryable<T>, IQueryable<T>>? orderBy = null, List<string>? includes = null,
        PaginationRequest? paginationRequest = null)
    {
        IQueryable<T> query = _db!;

        if (expression != null)
            query = query.Where(expression);

        if (includes != null)
            query = includes.Aggregate(query, (current, includeProperty) => current.Include(includeProperty));

        if (orderBy != null)
            query = orderBy(query);

        if (paginationRequest == null)
            return await query.AsNoTracking().ToListAsync();

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalItems / (double)paginationRequest.PageSize);
        var currentPage = paginationRequest.Page;
        var nextPage = currentPage < totalPages ? currentPage + 1 : (int?)null;
        var previousPage = currentPage > 1 ? currentPage - 1 : (int?)null;

        var results = await query.Skip((paginationRequest.Page - 1) * paginationRequest.PageSize)
            .Take((int)paginationRequest.PageSize)
            .AsNoTracking()
            .ToListAsync();

        return new PaginatedResult<T>
        {
            TotalItems = totalItems,
            CurrentPage = currentPage,
            NextPage = nextPage,
            PreviousPage = previousPage,
            TotalPages = totalPages,
            Results = results
        };
    }

    public async Task InsertAsync(T entity)
    {
        await _db!.AddAsync(entity);
    }

    public async Task InsertRangeAsync(IEnumerable<T> entities)
    {
        await _db!.AddRangeAsync(entities);
    }

    public void Update(T entity)
    {
        _db!.Attach(entity);
        _context!.Entry(entity).State = EntityState.Modified;
    }
}