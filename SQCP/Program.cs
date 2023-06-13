using SocketIOClient;
using SQCP.Contracts.DataAccess;
using SQCP.DataAccess;
using SQCP.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<SocketIO>(sp =>
{
    try
    {
        var client = new SocketIO("http://213.239.213.183:28765/", new SocketIOOptions()
        {
            Auth = new { token = "test" }
        });

        client.OnConnected += (sender, e) => { Console.WriteLine("Connected to the WebSocket server."); };

        client.OnError += (sender, e) =>
        {
            Console.WriteLine($"Error: failed to connect to the WebSocket server: {e}");
            Environment.Exit(-1);
        };

        var connectTask = Task.Run(() => client.ConnectAsync());
        var delayTask = Task.Delay(TimeSpan.FromSeconds(20));

        var completedTask = Task.WhenAny(connectTask, delayTask).Result;
        if (completedTask == delayTask || connectTask.IsFaulted)
        {
            Console.WriteLine("Failed to connect to the WebSocket server within the timeout period.");
            Environment.Exit(-1);
        }

        connectTask.GetAwaiter().GetResult();

        return client;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred while attempting to connect to the WebSocket server: {ex}");
        Environment.Exit(-1);
        throw;
    }
});

// Db Connection
/*builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("sqlConnection"))
);*/

// Add services to the container.
builder.Services.AddTransient<IUnitOfWork, UnitOfWork>();
builder.Services.AddHostedService<SocketService>();

// Auto-Mapper
//builder.Services.AddAutoMapper(typeof(MapperInitializer));

// CORS
builder.Services.AddCors(o =>
{
    o.AddPolicy("AllowAll", builder =>
        builder.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader()
    );
});

// Prevent JSON recursion error
builder.Services.AddControllers().AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();