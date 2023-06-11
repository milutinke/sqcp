namespace SQCP.Models.SquadJS;

public record Squad(int SquadId, string SquadName, int Size, bool Locked, int? TeamId, string? TeamName);