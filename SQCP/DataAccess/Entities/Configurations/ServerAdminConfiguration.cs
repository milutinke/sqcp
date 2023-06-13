using SQCP.DataAccess.Entities.Definitions;

namespace SQCP.DataAccess.Entities.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class ServerAdminConfiguration : IEntityTypeConfiguration<ServerAdmin>
{
    public void Configure(EntityTypeBuilder<ServerAdmin> builder)
    {
        builder
            .HasIndex(x => new { x.Name, x.SteamId })
            .IsUnique(true);
    }
}
