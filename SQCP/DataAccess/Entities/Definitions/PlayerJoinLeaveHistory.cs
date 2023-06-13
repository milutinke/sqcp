using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SQCP.DataAccess.Entities.Definitions;

public class PlayerJoinLeaveHistory
{
    public long Id { get; set; }

    [ForeignKey("Player")]
    public long PlayerId { get; set; }
    public Player? Player { get; set; }

    [ForeignKey("Server")]
    public long ServerId { get; set; }
    public Server? Server { get; set; }

    [Required]
    public string? EventType { get; set; }

    public DateTime Time { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
