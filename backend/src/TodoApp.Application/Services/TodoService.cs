using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;
using TodoApp.Application.Repositories;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.Services;

public class TodoService : ITodoService
{
    private readonly ITodoRepository _todoRepository;
    private readonly IRedisCache _redisCache;
    public TodoService(ITodoRepository todoRepository, IRedisCache redisCache)
    {
        _todoRepository = todoRepository;
        _redisCache = redisCache;
    }

    public async Task<IEnumerable<TodoDto>> GetTodosByStatusAsync(bool isCompleted)
    {
        throw new NotImplementedException();
    }

    public async Task<TodoDto> CreateTodoAsync(CreateTodoDto dto)
    {
        var todo = new Todo(dto.Title, dto.Description);
        await _todoRepository.AddAsync(todo);
        await _redisCache.RemoveAsync("todos_all"); // Invalidate cache
        return MapToDto(todo);
    }

    public async Task<TodoDto> UpdateTodoStatusAsync(Guid id, bool isCompleted)
    {
        // var todo = await _todoRepository.GetByIdAsync(id);
        throw new NotImplementedException();
    }

    public async Task DeleteTodoAsync(Guid id)
    {
        throw new NotImplementedException();
    }

    public async Task<TodoDto?> GetTodoByIdAsync(Guid id)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<TodoDto>> GetAllTodosAsync()
    {
        // Try get from cache
        var cachedTodos = await _redisCache.GetAsync<IEnumerable<TodoDto>>("todos_all");
        if (cachedTodos != null)
            return cachedTodos;

        // Get from database
        var todos = await _todoRepository.GetAllAsync();
        var todoDtos = todos.Select(MapToDto);

        // Set cache
        await _redisCache.SetAsync("todos_all", todoDtos, TimeSpan.FromMinutes(5));

        return todoDtos;
    }

    // Other implementation methods...

    private static TodoDto MapToDto(Todo todo)
    {
        return new TodoDto
        {
            Id = todo.Id,
            Title = todo.Title,
            Description = todo.Description,
            IsCompleted = todo.IsCompleted,
            CreatedAt = todo.CreatedAt,
            UpdatedAt = todo.UpdatedAt
        };
    }
}