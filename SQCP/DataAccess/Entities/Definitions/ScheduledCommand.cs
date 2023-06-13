using System.ComponentModel.DataAnnotations;

namespace SQCP.DataAccess.Entities.Definitions;

public class ScheduledCommand
{
    public long Id { get; set; }
    
    [Required]
    [MaxLength(32)]
    public string? Name { get; set; }
    
    [Required]
    [MaxLength(128)]
    public string? Command { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}
