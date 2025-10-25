namespace HealthConnect.Server.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public string StudentId { get; set; } = string.Empty;
        public string? NurseId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string TimeSlot { get; set; } = string.Empty;
        public string ConsultationType { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";
        public string SymptomsDescription { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public string? Prescription { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ApplicationUser Student { get; set; } = null!;
        public ApplicationUser? Nurse { get; set; }
    }
}
