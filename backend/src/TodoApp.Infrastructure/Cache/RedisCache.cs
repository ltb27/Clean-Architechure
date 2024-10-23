using System.Text.Json;
using StackExchange.Redis;
using TodoApp.Application.Interfaces;

namespace TodoApp.Infrastructure.Cache;

public class RedisCache : IRedisCache
{
    private readonly IConnectionMultiplexer _redis;
    private readonly IDatabase _db;

    public RedisCache(string connectionString)
    {
        _redis = ConnectionMultiplexer.Connect(connectionString);
        _db = _redis.GetDatabase();
    }

    public async Task<T> GetAsync<T>(string key)
    {
        var value = await _db.StringGetAsync(key);
        if (value.IsNull)
            return default;

        return JsonSerializer.Deserialize<T>(value);
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null)
    {
        var serializedValue = JsonSerializer.Serialize(value);
        await _db.StringSetAsync(key, serializedValue, expiry);
    }

    public async Task RemoveAsync(string key)
    {
        await _db.KeyDeleteAsync(key);
    }
}