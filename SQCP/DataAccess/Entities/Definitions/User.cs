using System.ComponentModel.DataAnnotations;

namespace SQCP.DataAccess.Entities.Definitions;

public class User
{
    public long Id { get; set; }
    
    [Required]
    [MaxLength(20)]
    public string? Username { get; set; }

    [Required]
    public string? Email { get; set; }
    
    [Required]
    public string? Password { get; set; }
    
    public string? Permissions { get; set; }
    
    public bool IsDeleted { get; set; }
    
    public DateTime? LastActive { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}
