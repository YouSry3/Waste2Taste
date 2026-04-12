using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodRescue.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddReportManagementSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Type",
                table: "reports",
                newName: "IssueType");

            migrationBuilder.AddColumn<string>(
                name: "CustomerName",
                table: "reports",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ListingName",
                table: "reports",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "OrderId",
                table: "reports",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RefundAmount",
                table: "reports",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "ReportCode",
                table: "reports",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "reports",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ReportResponses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ReportId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ResponderId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Attachment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReportResponses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReportResponses_Users_ResponderId",
                        column: x => x.ResponderId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReportResponses_reports_ReportId",
                        column: x => x.ReportId,
                        principalTable: "reports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_reports_OrderId",
                table: "reports",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportResponses_ReportId",
                table: "ReportResponses",
                column: "ReportId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportResponses_ResponderId",
                table: "ReportResponses",
                column: "ResponderId");

            migrationBuilder.AddForeignKey(
                name: "FK_reports_Orders_OrderId",
                table: "reports",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_reports_Orders_OrderId",
                table: "reports");

            migrationBuilder.DropTable(
                name: "ReportResponses");

            migrationBuilder.DropIndex(
                name: "IX_reports_OrderId",
                table: "reports");

            migrationBuilder.DropColumn(
                name: "CustomerName",
                table: "reports");

            migrationBuilder.DropColumn(
                name: "ListingName",
                table: "reports");

            migrationBuilder.DropColumn(
                name: "OrderId",
                table: "reports");

            migrationBuilder.DropColumn(
                name: "RefundAmount",
                table: "reports");

            migrationBuilder.DropColumn(
                name: "ReportCode",
                table: "reports");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "reports");

            migrationBuilder.RenameColumn(
                name: "IssueType",
                table: "reports",
                newName: "Type");
        }
    }
}
