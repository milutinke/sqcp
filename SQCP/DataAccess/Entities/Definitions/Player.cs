using System.ComponentModel.DataAnnotations;

namespace SQCP.DataAccess.Entities.Definitions;

public class Player
{
    public long Id { get; set; }
    
    [Required]
    [MaxLength(32)]
    public string? Name { get; set; }
    
    [Required]
    [MaxLength(64)]
    public string? SteamId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}
