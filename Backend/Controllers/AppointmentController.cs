using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AppointmentsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/appointments (Listar todas las citas para el Panel de Control)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAppointments([FromQuery] int? userId)
    {
        var query = _context.Appointments
            .Include(a => a.User)
            .Include(a => a.Service)
            .AsQueryable();

        if (userId.HasValue)
        {
            query = query.Where(a => a.UserId == userId.Value);
        }

        var appointments = await query.Select(a => new AppointmentDto
        {
            Id = a.Id,
            Date = a.Date,
            Status = a.Status,
            Notes = a.Notes,
            ClientName = a.User != null ? a.User.FullName : "Cliente desconocido",
            ServiceName = a.Service != null ? a.Service.Name : "Servicio sin especificar",
            ServicePrice = a.Service != null ? a.Service.Price : 0
        }).ToListAsync();

        return Ok(appointments);
    }

    // POST: api/appointments (Crear reserva desde el Frontend)
    [HttpPost]
    public async Task<ActionResult<AppointmentDto>> CreateAppointment(CreateAppointmentDto dto)
    {
        var user = await _context.Users.FindAsync(dto.UserId);
        var service = await _context.Services.FindAsync(dto.ServiceId);

        if (user == null || service == null)
        {
            return BadRequest(new { message = "Usuario o Servicio no válido." });
        }

        var appointment = new Appointment
        {
            Date = dto.Date,
            Notes = dto.Notes,
            UserId = dto.UserId,
            ServiceId = dto.ServiceId,
            Status = "Pending"
        };

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAppointments), new { id = appointment.Id }, new AppointmentDto
        {
            Id = appointment.Id,
            Date = appointment.Date,
            Status = appointment.Status,
            Notes = appointment.Notes,
            ClientName = user.FullName,
            ServiceName = service.Name,
            ServicePrice = service.Price
        });
    }

    // PUT: api/appointments/{id}/status (Cambiar estado: Pending, Completed, Cancelled)
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, UpdateStatusDto dto)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null)
        {
            return NotFound(new { message = "La cita no existe." });
        }

        appointment.Status = dto.Status;
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Estado de la cita actualizado a '{dto.Status}'." });
    }
}