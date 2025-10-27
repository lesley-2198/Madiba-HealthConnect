namespace HealthConnect.Server.Configuration
{
    public class ResendSettings
    {
        public string ApiKey { get; set; } = string.Empty;
        public string FromEmail {  get; set; } = string.Empty;
        public string FromName {  get; set; } = string.Empty;
        public string AdminEmail {  get; set; } = string.Empty;
    }
}
