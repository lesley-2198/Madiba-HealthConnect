using System.ComponentModel.DataAnnotations;

namespace HealthConnect.Server.DTOs
{
    public class RegisterNurseDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(8)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        public string EmployeeNumber { get; set; } = string.Empty;

        [Required]
        public string Specialization { get; set; } = string.Empty;

        [Required]
        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;
    }
}