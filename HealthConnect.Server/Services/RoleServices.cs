using HealthConnect.Server.Data;
using HealthConnect.Server.Models;
using Microsoft.AspNetCore.Identity;

namespace HealthConnect.Server.Services
{
    public class RoleService
    {
        public static async Task Initialize(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            // Create roles if they don't exist
            string[] roleNames = { "Admin", "Nurse", "Student" };

            foreach (var roleName in roleNames)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            // Create default admin user if it doesn't exist
            var adminEmail = "admin@mandela.ac.za";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                var admin = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FullName = "System Administrator",
                    Role = "Admin",
                    EmployeeNumber = "A123456",
                    Department = "Clinic Administration"
                };

                string adminPassword = "Admin123!"; // Change this in production!
                var createAdmin = await userManager.CreateAsync(admin, adminPassword);

                if (createAdmin.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "Admin");
                }
            }
        }
    }
}