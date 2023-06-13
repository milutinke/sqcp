using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SQCP.DataAccess.Entities.Definitions;

public class ServerAdmin
{
    public long Id { get; set; }

    [ForeignKey("Server")]
    public long ServerId { get; set; }
    public Server? Server { get; set; }

    [Required]
    [MaxLength(64)]
    public string? Name { get; set; }
    
    [Required]
    [MaxLength(64)]
    public string? SteamId { get; set; }
    
    [ForeignKey("Role")]
    public long RoleId { get; set; }
    public Role? Role { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}