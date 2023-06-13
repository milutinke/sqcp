using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SQCP.DataAccess.Entities.Definitions;

public class PlayerNameHistory
{
    public long Id { get; set; }

    [Required]
    [MaxLength(32)]
    public string? Name { get; set; }
    
    [ForeignKey("Player")]
    public long PlayerId { get; set; }
    public Player? Player { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}