using Microsoft.AspNetCore.Http;

namespace FoodRescue.BLL.Services.FileStorage;
public interface IFileStorageService
{
    // Images
    Task<Result<string>> SaveImageAsync(IFormFile imageFile, string subFolder = "products");
    Task<Result> DeleteImageAsync(string? imageUrl);

    // Documents (PDFs)
    Task<Result<string>> SaveDocumentAsync(IFormFile documentFile, string subFolder);
    Task<Result> DeleteDocumentAsync(string? documentUrl);

    // Generic
    Task<Result> DeleteFileAsync(string? fileUrl);
}
