using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SQCP.DataAccess.Entities.Definitions;

public class Log
{
    public long Id { get; set; }

    [ForeignKey("Server")]
    public long? ServerId { get; set; }
    public Server? Server { get; set; }

    [ForeignKey("User")]
    public long? UserId { get; set; }
    public User? User { get; set; }

    [Required]
    [MaxLength(512)]
    public string? Text { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}

