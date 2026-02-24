using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodRescue.DAL.Migrations
{
    /// <inheritdoc />
    public partial class EditedVendorRequestAndVendorEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "vendors",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BusinessLicenseUrl",
                table: "VendorRequests",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "VendorRequests",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HealthCertificateUrl",
                table: "VendorRequests",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddCheckConstraint(
                name: "CK_Vendor_Category_Enum",
                table: "vendors",
                sql: "[Category] IN ('Restaurant','Bakery','Cafe','Grocery','Deli','Market')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_VendorRequest_Category_Enum",
                table: "VendorRequests",
                sql: "[Category] IN ('Restaurant','Bakery','Cafe','Grocery','Deli','Market')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Vendor_Category_Enum",
                table: "vendors");

            migrationBuilder.DropCheckConstraint(
                name: "CK_VendorRequest_Category_Enum",
                table: "VendorRequests");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "vendors");

            migrationBuilder.DropColumn(
                name: "BusinessLicenseUrl",
                table: "VendorRequests");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "VendorRequests");

            migrationBuilder.DropColumn(
                name: "HealthCertificateUrl",
                table: "VendorRequests");
        }
    }
}
