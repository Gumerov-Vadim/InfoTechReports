using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AppealNumber",
                table: "Reports",
                newName: "ApplicationNumber");

            migrationBuilder.RenameColumn(
                name: "AppealLink",
                table: "Reports",
                newName: "ApplicationLink");

            migrationBuilder.RenameColumn(
                name: "AppealDate",
                table: "Reports",
                newName: "ApplicationDate");

            migrationBuilder.AlterColumn<string>(
                name: "InspectionResult",
                table: "Reports",
                type: "text",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ApplicationNumber",
                table: "Reports",
                newName: "AppealNumber");

            migrationBuilder.RenameColumn(
                name: "ApplicationLink",
                table: "Reports",
                newName: "AppealLink");

            migrationBuilder.RenameColumn(
                name: "ApplicationDate",
                table: "Reports",
                newName: "AppealDate");

            migrationBuilder.AlterColumn<int>(
                name: "InspectionResult",
                table: "Reports",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
