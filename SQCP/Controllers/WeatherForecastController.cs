using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SocketIOClient;
using SQCP.Models.SquadJS;

namespace SQCP.Controllers;

[ApiController]
[Route("[controller]")]
public class TestController : ControllerBase
{
    private readonly SocketIO _client;
    private readonly ILogger<TestController> _logger;

    public TestController(ILogger<TestController> logger, SocketIO client)
    {
        _logger = logger;
        _client = client;
    }
    
    [HttpGet(Name = "Players")]
    public Task<IActionResult> Players()
    {
        var completion = new TaskCompletionSource<IActionResult>();

        _client.EmitAsync("players", response =>
        {
            // You can print the returned data first to decide what to do next.
            // output: [{"result":true,"message":"Prometheus - server"}]
            _logger.LogInformation(response.ToString());
            var output = JsonConvert.DeserializeObject<List<List<Player>>>(response.ToString());
            completion.SetResult(Ok(output));
        });

        return completion.Task;
    }
}