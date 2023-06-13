namespace SQCP.Models.SquadJS;

public class Team
{
    public int Id { get; set; }
    public string? Name { get; set; }
    private readonly IDictionary<int, Squad>? _squads;

    public Team(int id, string name)
    {
        Id = id;
        Name = name;
        _squads = new Dictionary<int, Squad>();
    }

    public void AddSquad(Squad squad)
    {
        if (!_squads!.ContainsKey(squad.SquadId))
            _squads.Add(squad.SquadId, squad);
    }

    public void RemoveSquad(Squad squad)
    {
        if (_squads!.ContainsKey(squad.SquadId))
            _squads.Remove(squad.SquadId);
    }

    public IDictionary<int, Squad> GetSquads() => _squads!;
}