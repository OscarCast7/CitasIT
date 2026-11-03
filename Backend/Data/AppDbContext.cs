using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<Appointment> Appointments => Set<Appointment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed Services
        modelBuilder.Entity<Service>().HasData(
            new Service { Id = 1, Name = "Mantenimiento Técnico PC", Description = "Limpieza, formateo e instalación de SO.", Price = 45.00m, DurationMinutes = 60 },
            new Service { Id = 2, Name = "Diagnóstico e Infraestructura", Description = "Revisión de servidores, redes y cableado.", Price = 80.00m, DurationMinutes = 90 }
        );

        // Seed Users (Admin y Cliente)
        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, FullName = "Óscar Castañeda", Email = "admin@citasit.com", PasswordHash = "admin123", Role = "Admin" },
            new User { Id = 2, FullName = "Cliente Prueba", Email = "cliente@test.com", PasswordHash = "cliente123", Role = "Client" }
        );

        // Seed Appointment con Fecha Estática
        var staticDate = new DateTime(2026, 11, 15, 10, 0, 0, DateTimeKind.Utc);
        modelBuilder.Entity<Appointment>().HasData(
            new Appointment { Id = 1, Date = staticDate, Status = "Pending", Notes = "Revisión de servidor lento", UserId = 2, ServiceId = 2 }
        );
    }
}