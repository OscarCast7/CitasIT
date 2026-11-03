namespace Backend.Models;

public class Appointment
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string Status { get; set; } = "Pending";
    public string Notes { get; set; } = string.Empty;

    public int UserId { get; set; }
    public User? User { get; set; }

    public int ServiceId { get; set; }
    public Service? Service { get; set; }
}