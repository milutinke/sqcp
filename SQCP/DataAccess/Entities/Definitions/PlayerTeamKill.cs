using System.ComponentModel.DataAnnotations.Schema;

namespace SQCP.DataAccess.Entities.Definitions;

public class PlayerTeamKill
{
    public long Id { get; set; }

    [ForeignKey("Player")]
    public long? AttackerPlayerId { get; set; }
    public Player? AttackerPlayer { get; set; }

    [ForeignKey("Player")]
    public long? VictimPlayerId { get; set; }
    public Player? VictimPlayer { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}