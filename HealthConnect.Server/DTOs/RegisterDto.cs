using System.ComponentModel.DataAnnotations;

namespace HealthConnect.Server.DTOs
{
    public class RegisterDto
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
        public string StudentNumber { get; set; } = string.Empty;

        [Required]
        public string Campus { get; set; } = string.Empty;

        [Required]
        public string Course { get; set; } = string.Empty;

        [Required]
        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;
    }
}