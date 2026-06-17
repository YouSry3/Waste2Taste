using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodRescue.DAL.Migrations
{
    /// <inheritdoc />
    public partial class addMigrationALLThingsinDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Disappointment",
                table: "SentimentAnalysis",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Disgust",
                table: "SentimentAnalysis",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Frustration",
                table: "SentimentAnalysis",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Disappointment",
                table: "SentimentAnalysis");

            migrationBuilder.DropColumn(
                name: "Disgust",
                table: "SentimentAnalysis");

            migrationBuilder.DropColumn(
                name: "Frustration",
                table: "SentimentAnalysis");
        }
    }
}
