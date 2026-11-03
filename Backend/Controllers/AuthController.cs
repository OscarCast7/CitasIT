using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email && u.PasswordHash == dto.Password);

        if (user == null)
        {
            return Unauthorized(new { message = "Credenciales incorrectas." });
        }

        // Generamos un token simulado para consumo en Frontend
        var token = $"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.{user.Id}.{user.Role}";

        return Ok(new AuthResponseDto
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            Token = token
        });
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
    {
        // Validar si el email ya existe
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
        {
            return BadRequest(new { message = "El correo electrónico ya está registrado." });
        }

        // Crear el nuevo usuario
        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = dto.Password, // En producción se usaría un hash como BCrypt
            Role = "Client"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = $"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.{user.Id}.{user.Role}";

        return Ok(new AuthResponseDto
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            Token = token
        });
    }
}