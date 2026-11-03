namespace Backend.DTOs;

public class UpdateStatusDto
{
    public string Status { get; set; } = string.Empty; // "Pending", "Completed", "Cancelled"
}