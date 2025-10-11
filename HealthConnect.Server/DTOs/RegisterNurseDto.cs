namespace HealthConnect.Server.DTOs
{
    public class RegisterNurseDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string EmployeeNumber { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
    }
}