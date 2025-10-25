namespace HealthConnect.Server.Configuration
{
    public class EmailSettings
    {
        public string SmtpHost { get; set; } = string.Empty;
        public int SmtpPort { get; set; }
        public string SenderEmail { get; set; } = string.Empty;
        public string SenderName { get; set; } = string.Empty;
        public string AdminEmail { get; set; } = string.Empty;
        public string AppPassword { get; set; } = string.Empty;
    }
}
