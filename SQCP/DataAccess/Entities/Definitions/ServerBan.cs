using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SQCP.DataAccess.Entities.Definitions;

public class ServerBan
{
    public long Id { get; set; }

    [ForeignKey("Server")]
    public long ServerId { get; set; }
    public Server? Server { get; set; }

    [Required]
    [MaxLength(64)]
    public string? SteamId { get; set; }
    
    [Required]
    [MaxLength(96)]
    public string? Reason { get; set; }
    
    [Required]
    public long Duration { get; set; }
    
    [ForeignKey("User")]
    public long BannedBy { get; set; }
    public User? User { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}
