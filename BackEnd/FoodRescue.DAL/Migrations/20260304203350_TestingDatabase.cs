using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodRescue.DAL.Migrations
{
    /// <inheritdoc />
    public partial class TestingDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_reports_vendors_VendorId",
                table: "reports");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "vendors",
                newName: "Role");

            migrationBuilder.RenameColumn(
                name: "VendorId",
                table: "reports",
                newName: "ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_reports_UserId",
                table: "reports",
                newName: "IX_Reports_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_reports_VendorId",
                table: "reports",
                newName: "IX_Reports_ProductId");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "vendors",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Priority",
                table: "reports",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValueSql: "N'Medium'");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Products",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "Pending");

            migrationBuilder.CreateTable(
                name: "AISpoileRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Prediction = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Confidence = table.Column<decimal>(type: "decimal(3,2)", nullable: false),
                    SpoiledPercentage = table.Column<int>(type: "int", nullable: false),
                    IsSpoiled = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AISpoileRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AISpoileRequests_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VendorRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BusinessName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    HealthCertificateUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    BusinessLicenseUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValueSql: "N'Pending'"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    ReviewedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VendorRequests", x => x.Id);
                    table.CheckConstraint("CK_VendorRequest_Category_Enum", "[Category] IN ('Restaurant','Bakery','Cafe','Grocery','Deli','Market')");
                    table.CheckConstraint("CK_VendorRequest_Status_Enum", "[Status] IN ('Pending','Approved','Rejected')");
                    table.ForeignKey(
                        name: "FK_VendorRequests_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.AddCheckConstraint(
                name: "CK_Vendor_Category_Enum",
                table: "vendors",
                sql: "[Category] IN ('Restaurant','Bakery','Cafe','Grocery','Deli','Market')");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_CreatedAt_Status",
                table: "reports",
                columns: new[] { "CreatedAt", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_Reports_Priority",
                table: "reports",
                column: "Priority");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_Status",
                table: "reports",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_Status_Priority",
                table: "reports",
                columns: new[] { "Status", "Priority" });

            migrationBuilder.AddCheckConstraint(
                name: "CK_Report_Priority_Enum",
                table: "reports",
                sql: "[Priority] IN ('Low','Medium','High')");

            migrationBuilder.CreateIndex(
                name: "IX_AISpoileRequests_ProductId",
                table: "AISpoileRequests",
                column: "ProductId",
                unique: true);

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

            migrationBuilder.AddForeignKey(
                name: "FK_reports_Products_ProductId",
                table: "reports",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_reports_Products_ProductId",
                table: "reports");

            migrationBuilder.DropTable(
                name: "AISpoileRequests");

            migrationBuilder.DropTable(
                name: "VendorRequests");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Vendor_Category_Enum",
                table: "vendors");

            migrationBuilder.DropIndex(
                name: "IX_Reports_CreatedAt_Status",
                table: "reports");

            migrationBuilder.DropIndex(
                name: "IX_Reports_Priority",
                table: "reports");

            migrationBuilder.DropIndex(
                name: "IX_Reports_Status",
                table: "reports");

            migrationBuilder.DropIndex(
                name: "IX_Reports_Status_Priority",
                table: "reports");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Report_Priority_Enum",
                table: "reports");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "vendors");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Priority",
                table: "reports");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Products");

            migrationBuilder.RenameColumn(
                name: "Role",
                table: "vendors",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "reports",
                newName: "VendorId");

            migrationBuilder.RenameIndex(
                name: "IX_Reports_UserId",
                table: "reports",
                newName: "IX_reports_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Reports_ProductId",
                table: "reports",
                newName: "IX_reports_VendorId");

            migrationBuilder.AddForeignKey(
                name: "FK_reports_vendors_VendorId",
                table: "reports",
                column: "VendorId",
                principalTable: "vendors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
