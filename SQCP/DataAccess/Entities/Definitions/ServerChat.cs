using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SQCP.Models.SquadJS;

namespace SQCP.DataAccess.Entities.Definitions;

public class ServerChat
{
    public long Id { get; set; }

    [ForeignKey("Server")]
    public long ServerId { get; set; }
    public Server? Server { get; set; }

    [Required]
    [MaxLength(32)]
    public string? Username { get; set; }

    [Required]
    [MaxLength(256)]
    public string? Message { get; set; }
    
    [ForeignKey("Player")]
    public long? PlayerId { get; set; }
    public Models.SquadJS.Player? Player { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}