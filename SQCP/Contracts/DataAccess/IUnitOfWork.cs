using SQCP.DataAccess.Contracts;
using SQCP.DataAccess.Entities.Definitions;

namespace SQCP.Contracts.DataAccess;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<Log>? Logs { get; }
    IGenericRepository<Player>? Players { get; }
    IGenericRepository<PlayerJoinLeaveHistory>? PlayerJoinLeaveHistory { get; }
    IGenericRepository<PlayerNameHistory>? PlayerNameHistory { get; }
    IGenericRepository<PlayerTeamKill>? PlayerTeamKills { get; }
    IGenericRepository<PlayerWarning>? PlayerWarnings { get; }
    IGenericRepository<PreconfiguredReason>? PreconfiguredReasons { get; }
    IGenericRepository<Role>? Roles { get; }
    IGenericRepository<ScheduledCommand>? ScheduledCommands { get; }
    IGenericRepository<Server>? Servers { get; }
    IGenericRepository<ServerAdmin>? ServerAdmins { get; }
    IGenericRepository<ServerAllowedUser>? ServerAllowedUsers { get; }
    IGenericRepository<ServerBan>? ServerBans { get; }
    IGenericRepository<ServerChat>? ServerChat { get; }
    IGenericRepository<User>? Users { get; }
    IGenericRepository<UserNote>? UserNotes { get; }
    
    Task Save();
}