namespace TodoApp.Domain.Entities;

public class Todo
{
    public Guid Id { get; private set; }
    public string Title { get; private set; }
    public string Description { get; private set; }
    public bool IsCompleted { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    private Todo() { } // For EF Core

    public Todo(string title, string description)
    {
        Id = Guid.NewGuid();
        Title = title;
        Description = description;
        IsCompleted = false;
        CreatedAt = DateTime.UtcNow;
    }

    public void MarkComplete()
    {
        IsCompleted = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkIncomplete()
    {
        IsCompleted = false;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateDetails(string title, string description)
    {
        Title = title;
        Description = description;
        UpdatedAt = DateTime.UtcNow;
    }
}