using SQCP.DataAccess.Entities.Definitions;

namespace SQCP.DataAccess.Entities.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class PlayerConfiguration : IEntityTypeConfiguration<Player>
{
    public void Configure(EntityTypeBuilder<Player> builder)
    {
        builder
            .HasIndex(x => new { x.SteamId })
            .IsUnique(true);
    }
}
