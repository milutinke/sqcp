using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SQCP.DataAccess.Entities.Definitions;

public class PlayerWarning
{
    public long Id { get; set; }

    [ForeignKey("Player")]
    public long? PlayerId { get; set; }
    public Player? Player { get; set; }
    
    [ForeignKey("ServerAdmin")]
    public long? WarnedByServerAdminId { get; set; }
    public ServerAdmin? WarnedByServerAdmin { get; set; }

    [Required]
    [MaxLength(256)]
    public string? Warning { get; set; }

    public DateTime CreatedAt { get; set; }
}