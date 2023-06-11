namespace SQCP.Models.SquadJS;

public record Player(int PlayerId, string SteamId, string Name, int? SquadId, Squad? Squad, string? Suffix);