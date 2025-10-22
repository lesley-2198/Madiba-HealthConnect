using HealthConnect.Server.Data;
using HealthConnect.Server.DTOs;
using HealthConnect.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HealthConnect.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FullName = model.FullName,
                Role = "Student",
                StudentNumber = model.StudentNumber,
                Campus = model.Campus,
                Course = model.Course,
                PhoneNumber = model.PhoneNumber,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Student");
                return Ok(new { message = "Student registration successful" });
            }

            return BadRequest(new { errors = result.Errors });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);

            if (result.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                var roles = await _userManager.GetRolesAsync(user);

                var token = GenerateJwtToken(user, roles);

                return Ok(new
                {
                    token,
                    user = new
                    {
                        user.Id,
                        user.Email,
                        user.FullName,
                        user.Role,
                        user.StudentNumber,
                        user.EmployeeNumber,
                        user.Specialization,
                        user.Campus,
                        user.Course,
                        user.Department
                    }
                });
            }

            return Unauthorized(new { message = "Invalid login attempt" });
        }

        private string GenerateJwtToken(ApplicationUser user, IList<string> roles)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("Role", user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("register-nurse")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RegisterNurse([FromBody] RegisterNurseDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FullName = model.FullName,
                Role = "Nurse",
                EmployeeNumber = model.EmployeeNumber,
                Specialization = model.Specialization,
                PhoneNumber = model.PhoneNumber,
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Nurse");
                return Ok(new
                {
                    message = "Nurse registration successful",
                    nurse = new
                    {
                        user.Id,
                        user.Email,
                        user.FullName,
                        user.EmployeeNumber,
                        user.Specialization,
                        user.PhoneNumber,
                        user.IsAvailable
                    }
                });
            }

            return BadRequest(new { errors = result.Errors });
        }

        [HttpGet("nurses")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetNurses()
        {
            var nurses = await _userManager.Users
                .Where(u => u.Role == "Nurse")
                .Select(u => new
                {
                    u.Id,
                    u.Email,
                    u.FullName,
                    u.EmployeeNumber,
                    u.Specialization,
                    u.PhoneNumber,
                    u.IsAvailable,
                    u.Role
                })
                .ToListAsync();

            return Ok(nurses);
        }
    }
}