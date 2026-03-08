using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace FoodRescue.BLL.Services.FileStorage;
public class FileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _environment;

    // Limits
    private const long MaxImageSize = 10 * 1024 * 1024;      // 10MB for images
    private const long MaxDocumentSize = 10 * 1024 * 1024;  // 10MB for PDFs

    // Allowed extensions
    private static readonly string[] ImageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
    private static readonly string[] DocumentExtensions = { ".pdf" };

    public FileStorageService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    #region Images

    public async Task<Result<string>> SaveImageAsync(IFormFile imageFile, string subFolder = "products")
    {
        if (imageFile == null || imageFile.Length == 0)
            return Result.Failure<string>(new Error("NoFile", "No image file uploaded"));

        if (imageFile.Length > MaxImageSize)
            return Result.Failure<string>(new Error("FileTooLarge", "Image size exceeds 5MB limit"));

        var extension = Path.GetExtension(imageFile.FileName).ToLowerInvariant();
        if (!ImageExtensions.Contains(extension))
            return Result.Failure<string>(new Error("InvalidFileType", $"Only {string.Join(", ", ImageExtensions)} files are allowed"));

        return await SaveFileInternalAsync(imageFile, "images", subFolder);
    }

    public Task<Result> DeleteImageAsync(string? imageUrl)
    {
        return DeleteFileInternalAsync(imageUrl, "images");
    }

    #endregion

    #region Documents (PDFs)

    public async Task<Result<string>> SaveDocumentAsync(IFormFile documentFile, string subFolder)
    {
        if (documentFile == null || documentFile.Length == 0)
            return Result.Failure<string>(new Error("NoFile", "No document file uploaded"));

        if (documentFile.Length > MaxDocumentSize)
            return Result.Failure<string>(new Error("FileTooLarge", "Document size exceeds 10MB limit"));

        var extension = Path.GetExtension(documentFile.FileName).ToLowerInvariant();
        if (!DocumentExtensions.Contains(extension))
            return Result.Failure<string>(new Error("InvalidFileType", "Only PDF files are allowed"));

        return await SaveFileInternalAsync(documentFile, "documents", subFolder);
    }

    public Task<Result> DeleteDocumentAsync(string? documentUrl)
    {
        return DeleteFileInternalAsync(documentUrl, "documents");
    }

    #endregion

    #region Generic

    public Task<Result> DeleteFileAsync(string? fileUrl)
    {
        if (string.IsNullOrEmpty(fileUrl))
            return Task.FromResult(Result.Success());

        try
        {
            var filePath = Path.Combine(_environment.WebRootPath, fileUrl.TrimStart('/'));
            if (File.Exists(filePath))
                File.Delete(filePath);

            return Task.FromResult(Result.Success());
        }
        catch (Exception ex)
        {
            return Task.FromResult(Result.Failure(new Error("DeleteFailed", $"Failed to delete file: {ex.Message}")));
        }
    }

    #endregion

    #region Private Helpers

    private async Task<Result<string>> SaveFileInternalAsync(IFormFile file, string folderType, string subFolder)
    {
        var uploadsFolder = Path.Combine(_environment.WebRootPath, folderType, subFolder);

        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileNameWithoutExtension(file.FileName)}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        var fileUrl = $"/{folderType}/{subFolder}/{uniqueFileName}";
        return Result.Success(fileUrl);
    }

    private Task<Result> DeleteFileInternalAsync(string? fileUrl, string folderType)
    {
        if (string.IsNullOrEmpty(fileUrl))
            return Task.FromResult(Result.Success());

        try
        {
            var fileName = Path.GetFileName(fileUrl);
            var filePath = Path.Combine(_environment.WebRootPath, folderType, fileName);

            if (!File.Exists(filePath))
            {
                var mainFolder = Path.Combine(_environment.WebRootPath, folderType);
                if (Directory.Exists(mainFolder))
                {
                    var files = Directory.GetFiles(mainFolder, fileName, SearchOption.AllDirectories);
                    if (files.Any())
                        filePath = files.First();
                }
            }

            if (File.Exists(filePath))
                File.Delete(filePath);

            return Task.FromResult(Result.Success());
        }
        catch (Exception ex)
        {
            return Task.FromResult(Result.Failure(new Error("DeleteFailed", $"Failed to delete file: {ex.Message}")));
        }
    }

    #endregion
}