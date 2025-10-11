using Microsoft.AspNetCore.Identity;

namespace HealthConnect.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Role { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Role-specific properties
        public string? StudentNumber { get; set; }
        public string? EmployeeNumber { get; set; }
        public string? Specialization { get; set; }
        public string? Campus { get; set; }
        public string? Course { get; set; }
        public string? Department { get; set; }
        public bool? IsAvailable { get; set; }
    }
}
