using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Report> Reports { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Создаем администратора по умолчанию
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Username = "admin",
                PasswordHash = "jGl25bVBBBW96QiCTeD5srEq93ch50/z4GUVpYZ/388s=", // "admin123"
                Role = UserRole.Administrator
            }
        );

        // Конфигурация для списка исполнителей
        modelBuilder.Entity<Report>()
            .Property(e => e.Executors)
            .HasColumnType("text[]");
    }
} 