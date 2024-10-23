using Microsoft.EntityFrameworkCore;
using TodoApp.Domain.Entities;
using TodoApp.Domain.Repositories;
using TodoApp.Infrastructure.Data;

namespace TodoApp.Infrastructure.Repositories;

public class TodoRepository : ITodoRepository
{
    private readonly AppDbContext _context;

    public TodoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Todo> GetByIdAsync(Guid id)
    {
        return await _context.Todos.FindAsync(id);
    }

    public async Task<IEnumerable<Todo>> GetAllAsync()
    {
        return await _context.Todos.ToListAsync();
    }

    public async Task<IEnumerable<Todo>> GetByStatusAsync(bool isCompleted)
    {
        return await _context.Todos
            .Where(t => t.IsCompleted == isCompleted)
            .ToListAsync();
    }

    public async Task AddAsync(Todo todo)
    {
        await _context.Todos.AddAsync(todo);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Todo todo)
    {
        throw new NotImplementedException();
    }

    public async Task DeleteAsync(Guid id)
    {
        throw new NotImplementedException();
    }

    // Other implementation methods...
}