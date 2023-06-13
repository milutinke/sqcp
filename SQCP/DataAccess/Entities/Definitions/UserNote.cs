using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SQCP.DataAccess.Entities.Definitions;

public class UserNote
{
    public long Id { get; set; }

    [ForeignKey("User")]
    public long UserId { get; set; }
    public User? User { get; set; }
    
    [Required]
    [MaxLength(64)]
    public string? Title { get; set; }
    
    [Required]
    [MaxLength(4095)]
    public string? Body { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}