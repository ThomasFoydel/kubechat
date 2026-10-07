namespace Analytics.Api.Models;

public class MessageCreatedEvent
{
    public string EventId { get; set; } = string.Empty;
    public string EventType { get; set; } = string.Empty;
    public int Version { get; set; }
    public DateTime OccurredAt { get; set; }
    public MessageCreatedPayload Payload { get; set; } = new();
}

public class MessageCreatedPayload
{
    public string MessageId { get; set; } = string.Empty;
    public string ConversationId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public int ContentLength { get; set; }
    public DateTime CreatedAt { get; set; }
}