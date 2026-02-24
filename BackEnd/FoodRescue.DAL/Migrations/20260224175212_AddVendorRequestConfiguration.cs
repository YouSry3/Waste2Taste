using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodRescue.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddVendorRequestConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Status",
                table: "vendors",
                newName: "Role");

            migrationBuilder.CreateTable(
                name: "VendorRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BusinessName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValueSql: "N'Pending'"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    ReviewedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReviewedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VendorRequests", x => x.Id);
                    table.CheckConstraint("CK_VendorRequest_Status_Enum", "[Status] IN ('Pending','Approved','Rejected')");
                    table.ForeignKey(
                        name: "FK_VendorRequests_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VendorRequests_CreatedAt",
                table: "VendorRequests",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_VendorRequests_Status",
                table: "VendorRequests",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_VendorRequests_Status_CreatedAt",
                table: "VendorRequests",
                columns: new[] { "Status", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_VendorRequests_UserId",
                table: "VendorRequests",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VendorRequests");

            migrationBuilder.RenameColumn(
                name: "Role",
                table: "vendors",
                newName: "Status");
        }
    }
}
