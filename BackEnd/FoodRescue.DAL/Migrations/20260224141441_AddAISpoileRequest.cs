using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodRescue.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddAISpoileRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.CreateIndex(
                name: "IX_AISpoileRequests_ProductId",
                table: "AISpoileRequests",
                column: "ProductId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AISpoileRequests");
        }
    }
}
