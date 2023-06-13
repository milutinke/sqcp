using SQCP.Contracts.DataAccess;
using SQCP.DataAccess.Contracts;
using SQCP.DataAccess.Entities.Definitions;

namespace SQCP.DataAccess;

public class UnitOfWork : IUnitOfWork
{
    private readonly DatabaseContext? _context;

    private IGenericRepository<Log>? _logs { get; set; }
    private IGenericRepository<Player>? _players { get; set; }
    private IGenericRepository<PlayerJoinLeaveHistory>? _playerJoinLeaveHistory { get; set; }
    private IGenericRepository<PlayerNameHistory>? _playerNameHistory { get; set; }
    private IGenericRepository<PlayerTeamKill>? _playerTeamKills { get; set; }
    private IGenericRepository<PlayerWarning>? _playerWarnings { get; set; }
    private IGenericRepository<PreconfiguredReason>? _preconfiguredReasons { get; set; }
    private IGenericRepository<Role>? _roles { get; set; }
    private IGenericRepository<ScheduledCommand>? _scheduledCommands { get; set; }
    private IGenericRepository<Server>? _servers { get; set; }
    private IGenericRepository<ServerAdmin>? _serverAdmins { get; set; }
    private IGenericRepository<ServerAllowedUser>? _serverAllowedUsers { get; set; }
    private IGenericRepository<ServerBan>? _serverBans { get; set; }
    private IGenericRepository<ServerChat>? _serverChat { get; set; }
    private IGenericRepository<User>? _users { get; set; }
    private IGenericRepository<UserNote>? _userNotes { get; set; }

    public UnitOfWork(DatabaseContext? context)
    {
        _context = context;
    }

    public IGenericRepository<Log>? Logs => _logs ??= new GenericRepository<Log>(_context!);
    public IGenericRepository<Player>? Players => _players ??= new GenericRepository<Player>(_context!);

    public IGenericRepository<PlayerJoinLeaveHistory>? PlayerJoinLeaveHistory =>
        _playerJoinLeaveHistory ??= new GenericRepository<PlayerJoinLeaveHistory>(_context!);

    public IGenericRepository<PlayerNameHistory>? PlayerNameHistory =>
        _playerNameHistory ??= new GenericRepository<PlayerNameHistory>(_context!);

    public IGenericRepository<PlayerTeamKill>? PlayerTeamKills =>
        _playerTeamKills ??= new GenericRepository<PlayerTeamKill>(_context!);

    public IGenericRepository<PlayerWarning>? PlayerWarnings =>
        _playerWarnings ??= new GenericRepository<PlayerWarning>(_context!);

    public IGenericRepository<PreconfiguredReason>? PreconfiguredReasons =>
        _preconfiguredReasons ??= new GenericRepository<PreconfiguredReason>(_context!);

    public IGenericRepository<Role>? Roles => _roles ??= new GenericRepository<Role>(_context!);

    public IGenericRepository<ScheduledCommand>? ScheduledCommands =>
        _scheduledCommands ??= new GenericRepository<ScheduledCommand>(_context!);

    public IGenericRepository<Server>? Servers => _servers ??= new GenericRepository<Server>(_context!);

    public IGenericRepository<ServerAdmin>? ServerAdmins =>
        _serverAdmins ??= new GenericRepository<ServerAdmin>(_context!);

    public IGenericRepository<ServerAllowedUser>? ServerAllowedUsers =>
        _serverAllowedUsers ??= new GenericRepository<ServerAllowedUser>(_context!);

    public IGenericRepository<ServerBan>? ServerBans => _serverBans ??= new GenericRepository<ServerBan>(_context!);
    public IGenericRepository<ServerChat>? ServerChat => _serverChat ??= new GenericRepository<ServerChat>(_context!);
    public IGenericRepository<User>? Users => _users ??= new GenericRepository<User>(_context!);
    public IGenericRepository<UserNote>? UserNotes => _userNotes ??= new GenericRepository<UserNote>(_context!);

    public void Dispose()
    {
        _context!.Dispose();
        GC.SuppressFinalize(this);
    }

    public async Task Save()
    {
        await _context!.SaveChangesAsync();
    }
}