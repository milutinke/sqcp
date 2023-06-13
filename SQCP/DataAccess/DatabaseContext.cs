using Microsoft.EntityFrameworkCore;
using SQCP.DataAccess.Entities.Configurations;
using SQCP.DataAccess.Entities.Definitions;

namespace SQCP.DataAccess;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions options) : base(options)
    {
    }

    // Entities
    public DbSet<Log>? Logs { get; set; }
    public DbSet<Player>? Players { get; set; }
    public DbSet<PlayerJoinLeaveHistory>? PlayerJoinLeaveHistory { get; set; }
    public DbSet<PlayerNameHistory>? PlayerNameHistory { get; set; }
    public DbSet<PlayerTeamKill>? PlayerTeamKills { get; set; }
    public DbSet<PlayerWarning>? PlayerWarnings { get; set; }
    public DbSet<PreconfiguredReason>? PreconfiguredReasons { get; set; }
    public DbSet<Role>? Roles { get; set; }
    public DbSet<ScheduledCommand>? ScheduledCommands { get; set; }
    public DbSet<Server>? Servers { get; set; }
    public DbSet<ServerAdmin>? ServerAdmins { get; set; }
    public DbSet<ServerAllowedUser>? ServerAllowedUsers { get; set; }
    public DbSet<ServerBan>? ServerBans { get; set; }
    public DbSet<ServerChat>? ServerChat { get; set; }
    public DbSet<User>? Users { get; set; }
    public DbSet<UserNote>? UserNote { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        ConfigureEntities(builder);
        SeedData(builder);
    }

    private static void ConfigureEntities(ModelBuilder builder)
    {
        // Configurations
        builder.ApplyConfiguration(new PlayerConfiguration());
        builder.ApplyConfiguration(new RoleConfiguration());
        builder.ApplyConfiguration(new ServerAdminConfiguration());
        builder.ApplyConfiguration(new ServerConfiguration());
        builder.ApplyConfiguration(new UserConfiguration());
    }

    private static void SeedData(ModelBuilder builder)
    {
        // Add a default Admin user
        builder.Entity<User>().HasData(
            new User
            {
                Email = "admin@admin.com",
                Username = "admin",
                Password = "$2a$12$pOA/73gvgyeRz3RrhmmnoOF2fFGDLGgif26CKT7NPQvNdJYC3TlEG", // admin
                Permissions = "all"
            }
        );
    }
}