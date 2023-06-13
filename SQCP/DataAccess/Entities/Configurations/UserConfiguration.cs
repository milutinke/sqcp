using SQCP.DataAccess.Entities.Definitions;

namespace SQCP.DataAccess.Entities.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder
            .HasIndex(x => new { x.Username, x.Email })
            .IsUnique(true);
    }
}
