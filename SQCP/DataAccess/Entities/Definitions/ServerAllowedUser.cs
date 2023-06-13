using System.ComponentModel.DataAnnotations.Schema;

namespace SQCP.DataAccess.Entities.Definitions;

public class ServerAllowedUser
{
    public long Id { get; set; }

    [ForeignKey("Server")]
    public long ServerId { get; set; }
    public Server? Server { get; set; }

    [ForeignKey("User")]
    public long UserId { get; set; }
    public User? User { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
