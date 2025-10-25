using HealthConnect.Server.Configuration;
using HealthConnect.Server.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace HealthConnect.Server.Services
{
    public interface IEmailService
    {
        Task SendAppointmentNotificationAsync(Appointment appointment, string studentName, string studentNumber, string studentPhone);
        Task SendAppointmentAssignedEmailAsync(Appointment appointment, string studentEmail, string nurseName, string nurseSpecialization);
        Task SendConsultationCompleteEmailAsync(Appointment appointment, string studentEmail, string nurseName, string prescription);
    }

    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
        {
            _emailSettings = emailSettings.Value;
            _logger = logger;
        }

        public async Task SendAppointmentNotificationAsync(Appointment appointment, string studentName, string studentNumber, string studentPhone)
        {
            try
            {
                _logger.LogInformation($"🔵 Starting email send process...");
                _logger.LogInformation($"🔵 SMTP Host: {_emailSettings.SmtpHost}");
                _logger.LogInformation($"🔵 SMTP Port: {_emailSettings.SmtpPort}");
                _logger.LogInformation($"🔵 Sender: {_emailSettings.SenderEmail}");
                _logger.LogInformation($"🔵 Recipient: {_emailSettings.AdminEmail}");

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
                message.To.Add(new MailboxAddress("Admin", _emailSettings.AdminEmail));
                message.Subject = $"New Appointment Booked - {studentName}";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <html>
                        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                            <div style='max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;'>
                                <h2 style='color: #3c7ab7; border-bottom: 2px solid #3c7ab7; padding-bottom: 10px;'>
                                    New Appointment Notification
                                </h2>
                                
                                <p style='font-size: 16px; margin-top: 20px;'>
                                    A new appointment has been booked on Madiba HealthConnect.
                                </p>
                                
                                <div style='background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;'>
                                    <h3 style='color: #1a3a52; margin-top: 0;'>Appointment Details:</h3>
                                    <table style='width: 100%; border-collapse: collapse;'>
                                        <tr>
                                            <td style='padding: 8px 0; font-weight: bold; width: 40%;'>Student Name:</td>
                                            <td style='padding: 8px 0;'>{studentName}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 8px 0; font-weight: bold;'>Student Number:</td>
                                            <td style='padding: 8px 0;'>{studentNumber}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 8px 0; font-weight: bold;'>Phone Number:</td>
                                            <td style='padding: 8px 0;'>{studentPhone}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 8px 0; font-weight: bold;'>Date:</td>
                                            <td style='padding: 8px 0;'>{appointment.AppointmentDate:dddd, MMMM dd, yyyy}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 8px 0; font-weight: bold;'>Time:</td>
                                            <td style='padding: 8px 0;'>{appointment.TimeSlot}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 8px 0; font-weight: bold;'>Consultation Type:</td>
                                            <td style='padding: 8px 0;'>{appointment.ConsultationType}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 8px 0; font-weight: bold;'>Status:</td>
                                            <td style='padding: 8px 0;'><span style='background-color: #ffc107; padding: 4px 8px; border-radius: 4px; color: white;'>{appointment.Status}</span></td>
                                        </tr>
                                    </table>
                                    
                                    {(!string.IsNullOrEmpty(appointment.SymptomsDescription) ? $@"
                                    <div style='margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;'>
                                        <p style='margin: 0; font-weight: bold;'>Symptoms Description:</p>
                                        <p style='margin: 5px 0 0 0; color: #666;'>{appointment.SymptomsDescription}</p>
                                    </div>
                                    " : "")}
                                </div>
                                
                                <p style='margin-top: 20px; padding: 15px; background-color: #e3f2fd; border-left: 4px solid #3c7ab7; border-radius: 4px;'>
                                    <strong>Action Required:</strong> Please log in to the admin dashboard to assign a nurse to this appointment.
                                </p>
                                
                                <p style='color: #666; font-size: 14px; margin-top: 30px; text-align: center;'>
                                    This is an automated notification from Madiba HealthConnect.<br>
                                    Please do not reply to this email.
                                </p>
                            </div>
                        </body>
                        </html>
                    "
                };

                message.Body = bodyBuilder.ToMessageBody();

                _logger.LogInformation($"🔵 Connecting to SMTP server...");
                using var client = new SmtpClient();
                
                // FIX: Add certificate validation callback for development
                client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                
                await client.ConnectAsync(_emailSettings.SmtpHost, _emailSettings.SmtpPort, SecureSocketOptions.StartTls);

                _logger.LogInformation($"🔵 Authenticating...");
                await client.AuthenticateAsync(_emailSettings.SenderEmail, _emailSettings.AppPassword);

                _logger.LogInformation($"🔵 Sending email...");
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation($"✅ Email sent successfully to {_emailSettings.AdminEmail} for appointment {appointment.Id}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Failed to send email notification: {ex.Message}");
                _logger.LogError($"❌ Stack trace: {ex.StackTrace}");
                _logger.LogError($"❌ Inner exception: {ex.InnerException?.Message}");
                // Don't throw - we don't want email failures to break appointment creation
            }
        }

        public async Task SendAppointmentAssignedEmailAsync(Appointment appointment, string studentEmail, string nurseName, string nurseSpecialization)
        {
            try
            {
                _logger.LogInformation($"🔵 Sending assignment confirmation to student: {studentEmail}");

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
                message.To.Add(new MailboxAddress("Student", studentEmail));
                message.Subject = "Your Appointment Has Been Assigned - Madiba HealthConnect";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <html>
                        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                            <div style='max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;'>
                                <h2 style='color: #3c7ab7; border-bottom: 2px solid #3c7ab7; padding-bottom: 10px;'>
                                    Appointment Assigned ✅
                                </h2>
                                
                                <p style='font-size: 16px; margin-top: 20px;'>
                                    Good news! Your appointment has been assigned to a nurse.
                                </p>
                                
                                <div style='background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;'>
                                    <h3 style='color: #1a3a52; margin-top: 0;'>Appointment Details:</h3>
                                    <table style='width: 100%; border-collapse: collapse;'>
                                        <tr>
                                            <td style='padding: 8px 0; font-weight: bold; width: 40%;'>Date:</td>
                                            <td style='padding: 8px 0;'>{appointment.AppointmentDate:dddd, MMMM dd, yyyy}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 8px 0; font-weight: bold;'>Time:</td>
                                            <td style='padding: 8px 0;'>{appointment.TimeSlot}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 8px 0; font-weight: bold;'>Consultation Type:</td>
                                            <td style='padding: 8px 0;'>{appointment.ConsultationType}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 8px 0; font-weight: bold;'>Status:</td>
                                            <td style='padding: 8px 0;'><span style='background-color: #4caf50; padding: 4px 8px; border-radius: 4px; color: white;'>Assigned</span></td>
                                        </tr>
                                    </table>
                                </div>

                                <div style='background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4caf50;'>
                                    <h3 style='color: #1a3a52; margin-top: 0;'>Your Assigned Nurse:</h3>
                                    <p style='margin: 5px 0; font-size: 18px;'><strong>{nurseName}</strong></p>
                                    <p style='margin: 5px 0; color: #666;'>Specialization: {nurseSpecialization}</p>
                                </div>
                                
                                <p style='margin-top: 20px; padding: 15px; background-color: #e3f2fd; border-left: 4px solid #3c7ab7; border-radius: 4px;'>
                                    <strong>What's Next?</strong> Please arrive 5-10 minutes before your scheduled time. Bring your student ID and any relevant medical documents.
                                </p>
                                
                                <p style='color: #666; font-size: 14px; margin-top: 30px; text-align: center;'>
                                    This is an automated notification from Madiba HealthConnect.<br>
                                    Please do not reply to this email.
                                </p>
                            </div>
                        </body>
                        </html>
                    "
                };

                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();
                client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                await client.ConnectAsync(_emailSettings.SmtpHost, _emailSettings.SmtpPort, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_emailSettings.SenderEmail, _emailSettings.AppPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation($"✅ Assignment confirmation email sent to {studentEmail}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Failed to send assignment email: {ex.Message}");
            }
        }

        public async Task SendConsultationCompleteEmailAsync(Appointment appointment, string studentEmail, string nurseName, string prescription)
        {
            try
            {
                _logger.LogInformation($"🔵 Sending consultation complete email to student: {studentEmail}");

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
                message.To.Add(new MailboxAddress("Student", studentEmail));
                message.Subject = "Your Consultation is Complete - Madiba HealthConnect";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <html>
                        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                            <div style='max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;'>
                                <h2 style='color: #3c7ab7; border-bottom: 2px solid #3c7ab7; padding-bottom: 10px;'>
                                    Consultation Complete ✅
                                </h2>
                                
                                <p style='font-size: 16px; margin-top: 20px;'>
                                    Your consultation with <strong>{nurseName}</strong> has been completed.
                                </p>
                                
                                <div style='background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;'>
                                    <h3 style='color: #1a3a52; margin-top: 0;'>Consultation Summary:</h3>
                                    <table style='width: 100%; border-collapse: collapse;'>
                                        <tr>
                                            <td style='padding: 8px 0; font-weight: bold; width: 40%;'>Date:</td>
                                            <td style='padding: 8px 0;'>{appointment.AppointmentDate:dddd, MMMM dd, yyyy}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 8px 0; font-weight: bold;'>Time:</td>
                                            <td style='padding: 8px 0;'>{appointment.TimeSlot}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 8px 0; font-weight: bold;'>Nurse:</td>
                                            <td style='padding: 8px 0;'>{nurseName}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 8px 0; font-weight: bold;'>Status:</td>
                                            <td style='padding: 8px 0;'><span style='background-color: #2196f3; padding: 4px 8px; border-radius: 4px; color: white;'>Completed</span></td>
                                        </tr>
                                    </table>
                                </div>

                                {(!string.IsNullOrEmpty(prescription) ? $@"
                                <div style='background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ff9800;'>
                                    <h3 style='color: #1a3a52; margin-top: 0;'>Prescription & Instructions:</h3>
                                    <p style='margin: 5px 0; white-space: pre-wrap;'>{prescription}</p>
                                </div>
                                " : "")}
                                
                                <p style='margin-top: 20px; padding: 15px; background-color: #e3f2fd; border-left: 4px solid #3c7ab7; border-radius: 4px;'>
                                    <strong>Important:</strong> Please follow all instructions provided by your nurse. If you have any concerns or your symptoms worsen, please book a follow-up appointment or seek immediate medical attention.
                                </p>
                                
                                <p style='color: #666; font-size: 14px; margin-top: 30px; text-align: center;'>
                                    This is an automated notification from Madiba HealthConnect.<br>
                                    Please do not reply to this email.
                                </p>
                            </div>
                        </body>
                        </html>
                    "
                };

                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();
                client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                await client.ConnectAsync(_emailSettings.SmtpHost, _emailSettings.SmtpPort, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_emailSettings.SenderEmail, _emailSettings.AppPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation($"✅ Consultation complete email sent to {studentEmail}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Failed to send consultation complete email: {ex.Message}");
            }
        }
    }
}