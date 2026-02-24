using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodRescue.DAL.Migrations
{
    /// <inheritdoc />
    public partial class UpdateReportEntityToPriority : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_reports_vendors_VendorId",
                table: "reports");

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
                name: "Priority",
                table: "reports",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValueSql: "N'Medium'");

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
                name: "Priority",
                table: "reports");

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
