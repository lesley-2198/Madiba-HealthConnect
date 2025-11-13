using HealthConnect.Server.Data;
using HealthConnect.Server.DTOs;
using HealthConnect.Server.Models;
using HealthConnect.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json.Serialization;

namespace HealthConnect.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // All endpoints require authentication
    public class AppointmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailService _emailService;

        public AppointmentsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IEmailService emailService)
        {
            _context = context;
            _userManager = userManager;
            _emailService = emailService;
        }

        // GET: api/appointments
        [HttpGet]
        public async Task<IActionResult> GetAppointments()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            Console.WriteLine($"🔵 GET APPOINTMENTS: UserId from JWT: '{userId}'");
            Console.WriteLine($"🔵 GET APPOINTMENTS: User found: {user != null}");
            Console.WriteLine($"🔵 GET APPOINTMENTS: User role: '{user?.Role}'");

            if (user == null)
                return Unauthorized();

            List<Appointment> appointments;

            if (user.Role == "Student")
            {
                // Students can only see their own appointments
                appointments = await _context.Appointments
                    .Where(a => a.StudentId == userId)
                    .Include(a => a.Student)
                    .Include(a => a.Nurse)
                    .OrderByDescending(a => a.CreatedAt)
                    .ToListAsync();
            }
            else if (user.Role == "Nurse")
            {
                Console.WriteLine($"🟢 GET APPOINTMENTS: Querying appointments for Nurse ID: '{userId}'");

                // Nurses can see appointments assigned to them
                appointments = await _context.Appointments
                    .Where(a => a.NurseId == userId)
                    .Include(a => a.Student)
                    .Include(a => a.Nurse)
                    .OrderByDescending(a => a.CreatedAt)
                    .ToListAsync();

                Console.WriteLine($"🟢 GET APPOINTMENTS: Found {appointments.Count} appointments for nurse");

                foreach (var apt in appointments)
                {
                    Console.WriteLine($"   - Appointment {apt.Id}: NurseId='{apt.NurseId}', Status='{apt.Status}'");
                }
            }
            else if (user.Role == "Admin")
            {
                // Admins can see all appointments
                appointments = await _context.Appointments
                    .Include(a => a.Student)
                    .Include(a => a.Nurse)
                    .OrderByDescending(a => a.CreatedAt)
                    .ToListAsync();
            }
            else
            {
                return Forbid();
            }

            var response = appointments.Select(a => new AppointmentResponseDto
            {
                Id = a.Id,
                StudentId = a.StudentId,
                NurseId = a.NurseId,
                AppointmentDate = a.AppointmentDate,
                TimeSlot = a.TimeSlot,
                ConsultationType = a.ConsultationType,
                Status = a.Status,
                SymptomsDescription = a.SymptomsDescription,
                Notes = a.Notes,
                Prescription = a.Prescription,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                StudentName = a.Student.FullName,
                StudentNumber = a.Student.StudentNumber ?? "",
                StudentPhoneNumber = a.Student.PhoneNumber ?? "",
                NurseName = a.Nurse?.FullName,
                NurseEmployeeNumber = a.Nurse?.EmployeeNumber,
                NurseSpecialization = a.Nurse?.Specialization
            }).ToList();

            return Ok(response);
        }

        // GET: api/appointments/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppointment(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return Unauthorized();

            var appointment = await _context.Appointments
                .Include(a => a.Student)
                .Include(a => a.Nurse)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
                return NotFound();

            // Check permissions
            if (user.Role == "Student" && appointment.StudentId != userId)
                return Forbid();

            if (user.Role == "Nurse" && appointment.NurseId != userId)
                return Forbid();

            var response = new AppointmentResponseDto
            {
                Id = appointment.Id,
                StudentId = appointment.StudentId,
                NurseId = appointment.NurseId,
                AppointmentDate = appointment.AppointmentDate,
                TimeSlot = appointment.TimeSlot,
                ConsultationType = appointment.ConsultationType,
                Status = appointment.Status,
                SymptomsDescription = appointment.SymptomsDescription,
                Notes = appointment.Notes,
                Prescription = appointment.Prescription,  
                CreatedAt = appointment.CreatedAt,
                UpdatedAt = appointment.UpdatedAt,
                StudentName = appointment.Student.FullName,
                StudentPhoneNumber = appointment.Student.PhoneNumber ?? "",
                StudentNumber = appointment.Student.StudentNumber ?? "",
                NurseName = appointment.Nurse?.FullName,
                NurseSpecialization = appointment.Nurse?.Specialization
            };

            return Ok(response);
        }

        // POST: api/appointments
        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointmentDto model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return Unauthorized();

            // Only students can create appointments
            if (user.Role != "Student")
                return Forbid();

            // Check if appointment date is in the future
            if (model.AppointmentDate.Date < DateTime.Today)
                return BadRequest(new { message = "Appointment date cannot be in the past" });

            // Check if appointment is on weekend
            if (model.AppointmentDate.DayOfWeek == DayOfWeek.Saturday ||
                model.AppointmentDate.DayOfWeek == DayOfWeek.Sunday)
            {
                return BadRequest(new { message = "Appointments are not available on weekends. Please select a weekday." });
            }

            // Check for conflicts (same time slot on same date)
            var existingAppointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.AppointmentDate.Date == model.AppointmentDate.Date &&
                                         a.TimeSlot == model.TimeSlot);

            if (existingAppointment != null)
                return BadRequest(new { message = "Time slot is already booked" });

            var appointment = new Appointment
            {
                StudentId = userId,
                AppointmentDate = model.AppointmentDate,
                TimeSlot = model.TimeSlot,
                ConsultationType = model.ConsultationType,
                Status = "Pending",
                SymptomsDescription = model.SymptomsDescription,
                Notes = model.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            // Send email notification to admin
            await _emailService.SendAppointmentNotificationAsync(
                appointment,
                user.FullName,
                user.StudentNumber ?? "N/A",
                user.PhoneNumber ?? "N/A"
            );

            // Return the created appointment with student info
            var createdAppointment = await _context.Appointments
                .Include(a => a.Student)
                .FirstOrDefaultAsync(a => a.Id == appointment.Id);

            var response = new AppointmentResponseDto
            {
                Id = createdAppointment.Id,
                StudentId = createdAppointment.StudentId,
                NurseId = createdAppointment.NurseId,
                AppointmentDate = createdAppointment.AppointmentDate,
                TimeSlot = createdAppointment.TimeSlot,
                ConsultationType = createdAppointment.ConsultationType,
                Status = createdAppointment.Status,
                SymptomsDescription = createdAppointment.SymptomsDescription,
                Notes = createdAppointment.Notes,
                Prescription = createdAppointment.Prescription, 
                CreatedAt = createdAppointment.CreatedAt,
                UpdatedAt = createdAppointment.UpdatedAt,
                StudentName = createdAppointment.Student.FullName,
                StudentPhoneNumber = createdAppointment.Student.PhoneNumber ?? "",
                StudentNumber = createdAppointment.Student.StudentNumber ?? ""
            };

            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, response);
        }

        // PUT: api/appointments/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] UpdateAppointmentDto model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return Unauthorized();

            var appointment = await _context.Appointments
                .Include(a => a.Student)
                .Include(a => a.Nurse)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
                return NotFound();

            // Check permissions
            if (user.Role == "Student" && appointment.StudentId != userId)
                return Forbid();

            if (user.Role == "Nurse" && appointment.NurseId != userId)
                return Forbid();

            // Track if status is changing to "Completed"
            bool statusChangedToCompleted = false;
            if (!string.IsNullOrEmpty(model.Status) &&
                model.Status == "Completed" &&
                appointment.Status != "Completed")
            {
                statusChangedToCompleted = true;
            }

            // Update appointment fields
            if (model.AppointmentDate.HasValue)
                appointment.AppointmentDate = model.AppointmentDate.Value;

            if (!string.IsNullOrEmpty(model.TimeSlot))
                appointment.TimeSlot = model.TimeSlot;

            if (!string.IsNullOrEmpty(model.ConsultationType))
                appointment.ConsultationType = model.ConsultationType;

            if (!string.IsNullOrEmpty(model.SymptomsDescription))
                appointment.SymptomsDescription = model.SymptomsDescription;

            if (!string.IsNullOrEmpty(model.Notes))
                appointment.Notes = model.Notes;

            if (!string.IsNullOrEmpty(model.Prescription)) 
                appointment.Prescription = model.Prescription;

            if (!string.IsNullOrEmpty(model.NurseId))
                appointment.NurseId = model.NurseId;

            if (!string.IsNullOrEmpty(model.Status))
                appointment.Status = model.Status;

            appointment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Send email if consultation was marked complete
            if (statusChangedToCompleted)
            {
                await _emailService.SendConsultationCompleteEmailAsync(
                    appointment,
                    appointment.Student.Email,
                    appointment.Nurse?.FullName ?? "Your Nurse",
                    appointment.Prescription ?? ""
                );
            }

            return NoContent();
        }

        // DELETE: api/appointments/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return Unauthorized();

            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
                return NotFound();

            // Check permissions
            if (user.Role == "Student" && appointment.StudentId != userId)
                return Forbid();

            if (user.Role == "Admin")
            {
                // Admins can delete any appointment
            }
            else if (user.Role == "Nurse" && appointment.NurseId != userId)
            {
                return Forbid();
            }
            else if (user.Role == "Student" && appointment.Status != "Pending")
            {
                return BadRequest(new { message = "Cannot cancel confirmed appointments" });
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/appointments/{id}/assign
        [HttpPost("{id}/assign")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignAppointment(int id, [FromBody] AssignAppointmentDto model)
        {
            Console.WriteLine($"🔵 BACKEND: Received assignment request for Appointment ID: {id}");
            Console.WriteLine($"🔵 BACKEND: Model NurseId: '{model.NurseId}'");

            var appointment = await _context.Appointments
                .Include(a => a.Student)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
            {
                Console.WriteLine($"🔴 BACKEND: Appointment {id} not found");
                return NotFound();
            }

            if (appointment.Status != "Pending")
            {
                Console.WriteLine($"🔴 BACKEND: Appointment status is '{appointment.Status}', not 'Pending'");
                return BadRequest(new { message = "Only pending appointments can be assigned" });
            }

            Console.WriteLine($"🔵 BACKEND: Looking for nurse with ID: '{model.NurseId}'");
            var nurse = await _userManager.FindByIdAsync(model.NurseId);

            if (nurse == null || nurse.Role != "Nurse")
            {
                Console.WriteLine($"🔴 BACKEND: Nurse not found or invalid. Nurse is null: {nurse == null}, Role: {nurse?.Role}");
                return BadRequest(new { message = "Invalid nurse" });
            }

            Console.WriteLine($"🟢 BACKEND: Valid nurse found: {nurse.FullName}");
            Console.WriteLine($"🔵 BACKEND: Setting appointment.NurseId = '{model.NurseId}'");

            appointment.NurseId = model.NurseId;
            appointment.Status = "Assigned";
            appointment.UpdatedAt = DateTime.UtcNow;

            Console.WriteLine($"🔵 BACKEND: Before SaveChanges - NurseId: '{appointment.NurseId}'");
            await _context.SaveChangesAsync();
            Console.WriteLine($"🟢 BACKEND: SaveChanges completed");

            Console.WriteLine($"🔵 BACKEND: Sending assignment email to student: {appointment.Student.Email}");
            await _emailService.SendAppointmentAssignedEmailAsync(
                appointment,
                appointment.Student.Email ?? "",
                nurse.FullName,
                nurse.Specialization ?? "General Nursing"
            );
            Console.WriteLine($"🟢 BACKEND: Email service called");

            return Ok(new { message = "Appointment assigned successfully" });
        }

        public class AssignAppointmentDto
        {
            [JsonPropertyName("nurseId")] 
            public string NurseId { get; set; } = string.Empty;
        }
    }
}