using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HealthConnect.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddPrescriptionToAppointment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Prescription",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Prescription",
                table: "Appointments");
        }
    }
}
