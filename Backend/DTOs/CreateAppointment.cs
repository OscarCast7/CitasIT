namespace Backend.DTOs;

public class CreateAppointmentDto
{
    public DateTime Date { get; set; }
    public string Notes { get; set; } = string.Empty;
    public int UserId { get; set; }
    public int ServiceId { get; set; }
}