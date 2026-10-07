using Analytics.Api.Services;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

var redisUrl = builder.Configuration["REDIS_URL"] ?? "localhost:6379";
var redis = await ConnectionMultiplexer.ConnectAsync(redisUrl);

builder.Services.AddSingleton<IConnectionMultiplexer>(redis);
builder.Services.AddHostedService<MessageEventConsumer>();

var app = builder.Build();

app.MapGet("/health", async () =>
{
    await redis.GetDatabase().PingAsync();

    return Results.Ok(new
    {
        status = "ok",
        redis = "connected"
    });
});

app.Run();