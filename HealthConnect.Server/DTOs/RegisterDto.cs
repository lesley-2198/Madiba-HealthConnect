namespace HealthConnect.Server.DTOs
{
    public class RegisterDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = "Student";

        // Student-specific
        public string? StudentNumber { get; set; }
        public string? Campus { get; set; }
        public string? Course { get; set; }
        public string? Cellphone { get; set; }
    }
}