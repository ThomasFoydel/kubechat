using Analytics.Api.Models;
using StackExchange.Redis;
using System.Text.Json;

namespace Analytics.Api.Services;

public class MessageEventConsumer(
    IConnectionMultiplexer redis,
    ILogger<MessageEventConsumer> logger
) : BackgroundService
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var subscriber = redis.GetSubscriber();

        await subscriber.SubscribeAsync(
            RedisChannel.Literal("kubechat:events:message.created"),
            (channel, message) =>
            {
                try
                {
                    var messageEvent = JsonSerializer.Deserialize<MessageCreatedEvent>(
                        message.ToString(),
                        JsonOptions
                    );

                    if (messageEvent is null)
                    {
                        logger.LogWarning("Received invalid message.created event");
                        return;
                    }

                    logger.LogInformation(
                        "Received message {MessageId} in conversation {ConversationId}",
                        messageEvent.Payload.MessageId,
                        messageEvent.Payload.ConversationId
                    );
                }
                catch (JsonException exception)
                {
                    logger.LogError(exception, "Failed to deserialize message.created event");
                }
            }
        );

        await Task.Delay(Timeout.Infinite, stoppingToken);
    }
}