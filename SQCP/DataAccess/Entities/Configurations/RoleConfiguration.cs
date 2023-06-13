using SQCP.DataAccess.Entities.Definitions;

namespace SQCP.DataAccess.Entities.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder
            .HasIndex(x => new { x.Name })
            .IsUnique(true);
    }
}
