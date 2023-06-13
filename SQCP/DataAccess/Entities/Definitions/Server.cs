using System.ComponentModel.DataAnnotations;

namespace SQCP.DataAccess.Entities.Definitions;

public class Server
{
    public long Id { get; set; }

    [Required]
    [MaxLength(64)]
    public string? Name { get; set; }
    
    [Required]
    public string? Host { get; set; }

    [Required]
    public int Port { get; set; }

    [Required]
    public string? Token { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}