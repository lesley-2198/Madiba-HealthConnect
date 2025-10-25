namespace HealthConnect.Server.DTOs
{
    public class CreateAppointmentDto
    {
        public DateTime AppointmentDate { get; set; }
        public string TimeSlot { get; set; } = string.Empty;
        public string ConsultationType { get; set; } = string.Empty;
        public string SymptomsDescription { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }

    public class UpdateAppointmentDto
    {
        public DateTime? AppointmentDate { get; set; }
        public string? TimeSlot { get; set; }
        public string? ConsultationType { get; set; }
        public string? SymptomsDescription { get; set; }
        public string? Notes { get; set; }
        public string? Prescription { get; set; }  // ADD THIS LINE
        public string? NurseId { get; set; }
        public string? Status { get; set; }
    }

    public class AppointmentResponseDto
    {
        public int Id { get; set; }
        public string StudentId { get; set; } = string.Empty;
        public string? NurseId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string TimeSlot { get; set; } = string.Empty;
        public string ConsultationType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string SymptomsDescription { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public string? Prescription { get; set; }  // ADD THIS LINE
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Student details
        public string StudentName { get; set; } = string.Empty;
        public string StudentNumber { get; set; } = string.Empty;
        public string StudentPhoneNumber { get; set; } = string.Empty;

        // Nurse details (if assigned)
        public string? NurseName { get; set; }
        public string? NurseEmployeeNumber { get; set; }
        public string? NurseSpecialization { get; set; }
    }
}