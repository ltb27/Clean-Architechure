using TodoApp.Application.DTOs;

namespace TodoApp.Application.Services;

public interface ITodoService
{
    Task<TodoDto> GetTodoByIdAsync(Guid id);
    Task<IEnumerable<TodoDto>> GetAllTodosAsync();
    Task<IEnumerable<TodoDto>> GetTodosByStatusAsync(bool isCompleted);
    Task<TodoDto> CreateTodoAsync(CreateTodoDto dto);
    Task<TodoDto> UpdateTodoStatusAsync(Guid id, bool isCompleted);
    Task DeleteTodoAsync(Guid id);
}