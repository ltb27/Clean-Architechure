using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TodoApp.Application.DTOs;
using TodoApp.Application.Services;

namespace TodoApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodoController(ITodoService todoService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoDto>>> GetAll([FromQuery] bool? isCompleted = null)
    {
        if (isCompleted.HasValue)
            return Ok(await todoService.GetTodosByStatusAsync(isCompleted.Value));
        
        return Ok(await todoService.GetAllTodosAsync());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TodoDto>> GetById(Guid id)
    {
        var todo = await todoService.GetTodoByIdAsync(id);
        if (todo == null)
            return NotFound();

        return Ok(todo);
    }

    [HttpPost]
    public async Task<ActionResult<TodoDto>> Create(CreateTodoDto dto)
    {
        var created = await todoService.CreateTodoAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}/status")]
    public async Task<ActionResult<TodoDto>> UpdateStatus(Guid id, [FromBody] bool isCompleted)
    {
        var updated = await todoService.UpdateTodoStatusAsync(id, isCompleted);
        if (updated == null)
            return NotFound();

        return Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await todoService.DeleteTodoAsync(id);
        return NoContent();
    }
}