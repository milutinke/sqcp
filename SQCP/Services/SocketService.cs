using SocketIOClient;

namespace SQCP.Services;

public class SocketService : IHostedService
{
    private readonly SocketIO _client;

    public SocketService(SocketIO client)
    {
        _client = client;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        _client.OnConnected += async (sender, e) => {
            
        };
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return _client.DisconnectAsync();
    }
}
