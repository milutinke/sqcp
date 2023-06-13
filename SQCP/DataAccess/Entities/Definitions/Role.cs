using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace SQCP.DataAccess.Entities.Definitions;

public class Role
{
    public long Id { get; set; }
    
    [Required]
    [MaxLength(32)]
    public string? Name { get; set; }
    
    [Required]
    public string? Permissions { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}
