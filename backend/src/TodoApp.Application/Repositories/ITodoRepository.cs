using TodoApp.Domain.Entities;

namespace TodoApp.Application.Repositories;

public interface ITodoRepository
{
    Task<Todo?> GetByIdAsync(Guid id);
    Task<IEnumerable<Todo>> GetAllAsync();
    Task<IEnumerable<Todo>> GetByStatusAsync(bool isCompleted);
    Task AddAsync(Todo todo);
    Task UpdateAsync(Todo todo);
    Task DeleteAsync(Guid id);
}