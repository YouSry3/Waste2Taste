# ASP.NET Core Integration Guide

This frontend application is structured for easy integration with an ASP.NET Core REST API backend.

## 📁 Project Structure

```
/
├── components/           # React components organized by panel
│   ├── admin/           # Moderation panel components
│   ├── vendor/          # Corporate panel components
│   ├── charity/         # Charity panel components
│   ├── auth/            # Authentication components
│   └── ui/              # Reusable UI components
├── services/            # API services and utilities
│   ├── api/            # API client and configuration
│   └── auth/           # Authentication service
├── types/              # TypeScript type definitions
│   └── models.ts       # Data models matching backend DTOs
└── App.tsx             # Main application component
```

## 🔧 Configuration

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
# API Base URL - Update to match your ASP.NET Core API
VITE_API_BASE_URL=https://localhost:5001/api

# Other environment variables as needed
VITE_ENABLE_MOCK_DATA=false
```

### 2. API Configuration

Update `/services/api/apiConfig.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:5001/api',
  // ... rest of configuration
};
```

## 🔌 API Integration Points

### Authentication

The app uses JWT-based authentication. Your ASP.NET Core API should implement these endpoints:

#### POST `/api/auth/login`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "panelType": "admin" | "vendor" | "charity"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "refresh-token-here",
    "expiration": "2025-12-03T10:00:00Z",
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "User Name",
      "panelType": "admin",
      "roles": ["Admin"]
    }
  }
}
```

#### POST `/api/auth/logout`
**Request:** (Token in Authorization header)
**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### POST `/api/auth/refresh-token`
**Request:**
```json
{
  "refreshToken": "refresh-token-here"
}
```

**Response:** Same as login response

### API Response Format

All API responses should follow this structure:

```csharp
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T Data { get; set; }
    public string Message { get; set; }
    public List<string> Errors { get; set; }
    public int StatusCode { get; set; }
}
```

Example ASP.NET Core controller:

```csharp
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    [HttpGet("dashboard")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<AdminDashboardStats>>> GetDashboard()
    {
        try
        {
            var stats = await _adminService.GetDashboardStatsAsync();
            
            return Ok(new ApiResponse<AdminDashboardStats>
            {
                Success = true,
                Data = stats,
                StatusCode = 200
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<AdminDashboardStats>
            {
                Success = false,
                Message = ex.Message,
                StatusCode = 400
            });
        }
    }
}
```

## 🔐 CORS Configuration

Add CORS configuration in your ASP.NET Core `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("FoodRescueCors", builder =>
    {
        builder.WithOrigins("http://localhost:5173") // Vite dev server
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

// After building the app
app.UseCors("FoodRescueCors");
```

## 📦 Required ASP.NET Core Packages

```xml
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
<PackageReference Include="Microsoft.AspNetCore.Identity.EntityFrameworkCore" Version="8.0.0" />
<PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="7.0.0" />
```

## 🚀 Using the API Client

### Example: Fetching Dashboard Data

```typescript
import { apiClient } from '@/services/api/apiClient';
import { API_CONFIG } from '@/services/api/apiConfig';
import { AdminDashboardStats } from '@/types/models';

async function fetchDashboardStats() {
  try {
    const response = await apiClient.get<AdminDashboardStats>(
      API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch dashboard stats');
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    throw error;
  }
}
```

### Example: Creating a Listing

```typescript
import { apiClient } from '@/services/api/apiClient';
import { API_CONFIG } from '@/services/api/apiConfig';
import { Listing } from '@/types/models';

async function createListing(listingData: Partial<Listing>) {
  try {
    const response = await apiClient.post<Listing>(
      API_CONFIG.ENDPOINTS.VENDOR.LISTINGS,
      listingData
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to create listing');
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
}
```

## 🔄 State Management (Optional)

For more complex state management, consider:

1. **React Query / TanStack Query** - For server state management
2. **Zustand** - For client state management
3. **React Context** - For simple global state

Example with React Query:

```typescript
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api/apiClient';
import { API_CONFIG } from '@/services/api/apiConfig';

function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await apiClient.get(
        API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD
      );
      return response.data;
    },
  });
}
```

## 📝 Data Model Mapping

The TypeScript models in `/types/models.ts` should match your C# DTOs/Models:

**TypeScript:**
```typescript
export interface Listing {
  id: string;
  title: string;
  price: number;
  // ... other fields
}
```

**C# (Backend):**
```csharp
public class ListingDto
{
    public string Id { get; set; }
    public string Title { get; set; }
    public decimal Price { get; set; }
    // ... other properties
}
```

## 🧪 Testing with Mock Data

During development, you can enable mock data:

1. Set `VITE_ENABLE_MOCK_DATA=true` in `.env`
2. Create mock data files in `/services/mocks/`
3. Use conditional imports based on environment

## 🔍 Error Handling

The API client includes comprehensive error handling:

- **Network errors** - Connection issues
- **Timeout errors** - Requests exceeding 30 seconds
- **HTTP errors** - 4xx and 5xx status codes
- **Validation errors** - Field-level validation from backend

Example error handling in components:

```typescript
try {
  await createListing(data);
  toast.success('Listing created successfully');
} catch (error) {
  if (error instanceof ApiError) {
    if (error.errors) {
      // Show validation errors
      error.errors.forEach(err => toast.error(err));
    } else {
      toast.error(error.message);
    }
  }
}
```

## 🚀 Deployment

### Frontend Build
```bash
npm run build
```

The build output will be in `/dist` directory.

### Serving with ASP.NET Core

Option 1: Serve as static files from ASP.NET Core:

```csharp
app.UseStaticFiles();
app.UseSpaStaticFiles();

app.MapFallbackToFile("index.html");
```

Option 2: Deploy frontend separately (Vercel, Netlify, etc.) and update CORS accordingly.

## 📚 Additional Resources

- [ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core)
- [JWT Authentication in ASP.NET Core](https://docs.microsoft.com/aspnet/core/security/authentication/jwt)
- [Vite Documentation](https://vitejs.dev/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## 🤝 Support

For integration questions or issues, please refer to the main project documentation or contact the development team.
