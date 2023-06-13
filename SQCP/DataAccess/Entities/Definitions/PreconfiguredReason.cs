using System.ComponentModel.DataAnnotations;

namespace SQCP.DataAccess.Entities.Definitions;

public class PreconfiguredReason
{
    public long Id { get; set; }
    
    [Required]
    [MaxLength(32)]
    public string? Name { get; set; }
    
    [Required]
    [MaxLength(96)]
    public string? Reason { get; set; }

    [Required]
    public string? Type { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}
