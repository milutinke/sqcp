using SQCP.DataAccess.Entities.Definitions;

namespace SQCP.DataAccess.Entities.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class ServerConfiguration : IEntityTypeConfiguration<Server>
{
    public void Configure(EntityTypeBuilder<Server> builder)
    {
        builder
            .HasIndex(x => new { x.Name })
            .IsUnique(true);
    }
}
