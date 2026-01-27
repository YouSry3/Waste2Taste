# API Endpoints Reference

This document outlines all API endpoints that your ASP.NET Core backend should implement to integrate with this frontend application.

## Base URL
```
https://your-domain.com/api
```

## Response Format

All endpoints should return responses in this format:

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional message",
  "errors": ["Optional error messages"],
  "statusCode": 200
}
```

## Pagination Format

For list endpoints, use this pagination structure:

```json
{
  "success": true,
  "data": {
    "items": [/* array of items */],
    "totalCount": 150,
    "pageNumber": 1,
    "pageSize": 20,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## 🔐 Authentication Endpoints

### POST `/auth/login`
Login user and return JWT token.

**Request Body:**
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
    "refreshToken": "refresh-token-string",
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

**Status Codes:**
- 200: Success
- 401: Invalid credentials
- 403: No access to selected panel type

---

### POST `/auth/logout`
Logout current user and invalidate token.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### POST `/auth/refresh-token`
Refresh expired access token.

**Request Body:**
```json
{
  "refreshToken": "refresh-token-string"
}
```

**Response:** Same as login response

---

### GET `/auth/verify-token`
Verify if current token is valid.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isValid": true,
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

---

## 👨‍💼 Admin/Moderation Panel Endpoints

### GET `/admin/dashboard`
Get admin dashboard statistics.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 125000.50,
    "totalOrders": 450,
    "activeVendors": 48,
    "activeUsers": 1250,
    "pendingVendorRequests": 5,
    "pendingReports": 8,
    "pendingListings": 12,
    "revenueChange": 15.5,
    "ordersChange": 8.2
  }
}
```

---

### GET `/admin/listings`
Get all platform listings with pagination.

**Query Parameters:**
- `pageNumber` (int): Page number (default: 1)
- `pageSize` (int): Items per page (default: 20)
- `sortBy` (string): Sort field
- `sortOrder` (string): "asc" or "desc"
- `status` (string): Filter by status
- `search` (string): Search query

**Response:** Paginated list of listings

---

### GET `/admin/listings/{id}`
Get listing details by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "listing-id",
    "vendorId": "vendor-id",
    "vendorName": "Green Valley Bakery",
    "title": "Fresh Croissants Pack",
    "description": "4 freshly baked croissants",
    "category": "Bakery",
    "originalPrice": 50.00,
    "discountedPrice": 25.00,
    "quantity": 10,
    "availableQuantity": 7,
    "pickupTimeStart": "2025-12-02T18:00:00Z",
    "pickupTimeEnd": "2025-12-02T20:00:00Z",
    "expiryDate": "2025-12-02T23:59:59Z",
    "status": "Active",
    "images": ["url1", "url2"],
    "isFree": false,
    "isNGODonation": false,
    "aiDetectionFlag": {
      "isFlagged": false,
      "reason": null,
      "confidence": null
    },
    "createdAt": "2025-12-01T10:00:00Z",
    "updatedAt": "2025-12-01T10:00:00Z"
  }
}
```

---

### PATCH `/admin/listings/{id}/status`
Update listing status.

**Request Body:**
```json
{
  "status": "Active" | "Expired" | "Rejected" | "Completed"
}
```

---

### GET `/admin/orders`
Get all orders with pagination.

**Query Parameters:** Same as listings

**Response:** Paginated list of orders

---

### GET `/admin/vendors`
Get all vendors with pagination.

**Response:** Paginated list of vendors

---

### GET `/admin/users`
Get all users with pagination.

**Response:** Paginated list of users

---

### GET `/admin/vendors/map`
Get vendor locations for map view.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "location-id",
      "vendorId": "vendor-id",
      "name": "Green Valley Bakery - Downtown",
      "address": "123 Main St, Cairo",
      "city": "Cairo",
      "latitude": 30.0444,
      "longitude": 31.2357,
      "phoneNumber": "+20123456789",
      "isActive": true
    }
  ]
}
```

---

### GET `/admin/moderation/listings`
Get pending listings for moderation.

**Response:** Paginated list of pending listings with AI flags

---

### POST `/admin/moderation/listings/{id}/moderate`
Approve or reject a listing.

**Request Body:**
```json
{
  "approved": true,
  "notes": "Looks good" | "Rejected due to..."
}
```

---

### GET `/admin/moderation/reports`
Get customer reports.

**Response:** Paginated list of customer reports

---

### PATCH `/admin/moderation/reports/{id}`
Update report status.

**Request Body:**
```json
{
  "status": "UnderReview" | "Resolved" | "Rejected",
  "resolution": "Admin resolution notes"
}
```

---

### GET `/admin/moderation/vendor-requests`
Get vendor onboarding requests.

**Response:** Paginated list of vendor requests

---

### POST `/admin/moderation/vendor-requests/{id}/moderate`
Approve or reject vendor request.

**Request Body:**
```json
{
  "approved": true,
  "notes": "Approved" | "Missing documents"
}
```

---

## 🏪 Vendor/Corporate Panel Endpoints

### GET `/vendor/dashboard`
Get vendor dashboard statistics.

**Query Parameters:**
- `branchIds` (string): Comma-separated branch IDs (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 15000.00,
    "totalOrders": 75,
    "activeListings": 12,
    "completedOrders": 68,
    "pendingOrders": 7,
    "revenueChange": 12.5,
    "ordersChange": 5.8
  }
}
```

---

### GET `/vendor/branches`
Get vendor's branches/locations.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "branch-id",
      "vendorId": "vendor-id",
      "name": "Green Valley Bakery - Downtown",
      "address": "123 Main St",
      "city": "Cairo",
      "latitude": 30.0444,
      "longitude": 31.2357,
      "phoneNumber": "+20123456789",
      "isActive": true
    }
  ]
}
```

---

### GET `/vendor/orders`
Get vendor orders.

**Query Parameters:**
- Pagination params
- `branchIds` (string): Filter by branches

**Response:** Paginated list of orders

---

### PATCH `/vendor/orders/{id}/status`
Update order status.

**Request Body:**
```json
{
  "status": "Confirmed" | "ReadyForPickup" | "Completed" | "Cancelled"
}
```

---

### GET `/vendor/listings`
Get vendor listings.

**Query Parameters:**
- Pagination params
- `branchIds` (string): Filter by branches

**Response:** Paginated list of listings

---

### POST `/vendor/listings`
Create new listing.

**Request Body:**
```json
{
  "vendorLocationId": "location-id",
  "title": "Fresh Croissants Pack",
  "description": "4 freshly baked croissants",
  "category": "Bakery",
  "originalPrice": 50.00,
  "discountedPrice": 25.00,
  "quantity": 10,
  "pickupTimeStart": "2025-12-02T18:00:00Z",
  "pickupTimeEnd": "2025-12-02T20:00:00Z",
  "expiryDate": "2025-12-02T23:59:59Z",
  "images": ["url1", "url2"],
  "isFree": false,
  "isNGODonation": false
}
```

---

### PUT `/vendor/listings/{id}`
Update listing.

**Request Body:** Same as create (partial update)

---

### DELETE `/vendor/listings/{id}`
Delete listing.

---

### PATCH `/vendor/listings/{id}/toggle`
Toggle listing active status.

**Request Body:**
```json
{
  "active": true | false
}
```

---

### POST `/vendor/listings/upload-image`
Upload listing image.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `image`: Image file

**Response:**
```json
{
  "success": true,
  "data": {
    "imageUrl": "https://storage.example.com/image.jpg"
  }
}
```

---

### GET `/vendor/analytics`
Get vendor analytics.

**Query Parameters:**
- `branchIds` (string): Filter by branches
- `startDate` (string): Start date (ISO 8601)
- `endDate` (string): End date (ISO 8601)

**Response:**
```json
{
  "success": true,
  "data": {
    "revenue": [
      {
        "date": "2025-12-01",
        "revenue": 1500.00,
        "orders": 25
      }
    ],
    "topListings": [
      {
        "listingId": "listing-id",
        "listingTitle": "Fresh Croissants Pack",
        "totalOrders": 45,
        "totalRevenue": 1125.00,
        "averageRating": 4.5
      }
    ]
  }
}
```

---

### GET `/vendor/reports`
Get customer reports for vendor.

**Response:** Paginated list of customer reports

---

### POST `/vendor/reports/{id}/respond`
Respond to customer report.

**Request Body:**
```json
{
  "response": "We apologize for the inconvenience...",
  "proofImages": ["url1", "url2"]
}
```

---

### GET `/vendor/corporate/sub-accounts`
Get sub-accounts (Corporate Control).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "sub-account-id",
      "vendorId": "vendor-id",
      "name": "Ahmed Khalil",
      "email": "ahmed@example.com",
      "role": "Branch Manager",
      "assignedLocations": [/* location objects */],
      "isActive": true,
      "createdAt": "2025-10-15T10:00:00Z"
    }
  ]
}
```

---

### POST `/vendor/corporate/sub-accounts`
Create sub-account.

**Request Body:**
```json
{
  "name": "Ahmed Khalil",
  "email": "ahmed@example.com",
  "role": "Branch Manager",
  "locationIds": ["loc1", "loc2"]
}
```

---

### PUT `/vendor/corporate/sub-accounts/{id}`
Update sub-account.

---

### DELETE `/vendor/corporate/sub-accounts/{id}`
Delete sub-account.

---

### GET `/vendor/corporate/locations`
Get available locations for corporate control.

**Response:** List of vendor locations

---

## ❤️ Charity Panel Endpoints

### GET `/charity/dashboard`
Get charity dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "pendingVerifications": 8,
    "approvedUsers": 156,
    "activeListings": 5,
    "totalFreebiesDistributed": 432,
    "peopleHelpedToday": 12,
    "peopleHelpedThisMonth": 156
  }
}
```

---

### GET `/charity/verification-requests`
Get user verification requests.

**Response:** Paginated list of verification requests

---

### POST `/charity/verification-requests/{id}/moderate`
Approve or reject verification request.

**Request Body:**
```json
{
  "approved": true,
  "notes": "Approved" | "Invalid documents"
}
```

---

### GET `/charity/approved-users`
Get approved charity users.

**Query Parameters:** Pagination params

**Response:** Paginated list of approved users

---

### GET `/charity/listings`
Get charity's free food listings.

**Response:** Paginated list of listings

---

### POST `/charity/listings`
Create free food listing.

**Request Body:**
```json
{
  "title": "Bakery Donation Box",
  "description": "Fresh bread and pastries",
  "quantity": 10,
  "pickupTimeStart": "2025-12-02T18:00:00Z",
  "pickupTimeEnd": "2025-12-02T19:00:00Z",
  "images": ["url1"]
}
```

---

### GET `/charity/analytics`
Get charity analytics.

**Response:**
```json
{
  "success": true,
  "data": {
    "verificationsOverTime": [/* time series data */],
    "distributionByCategory": [/* category breakdown */],
    "topDistributionDays": [/* daily stats */]
  }
}
```

---

## 🔒 Authorization

All endpoints (except `/auth/login`) require a valid JWT token in the Authorization header:

```
Authorization: Bearer {jwt-token}
```

## 🎯 Role-Based Access

- **Admin endpoints** (`/admin/*`): Require `Admin` role
- **Vendor endpoints** (`/vendor/*`): Require `Vendor` role
- **Charity endpoints** (`/charity/*`): Require `Charity` role

## 📝 Notes for Backend Implementation

1. **Validation**: Implement model validation using FluentValidation or Data Annotations
2. **Error Handling**: Use global exception handler to return consistent error responses
3. **Logging**: Log all requests and errors
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **File Upload**: Handle file uploads securely, validate file types and sizes
6. **Database**: Use Entity Framework Core with proper migrations
7. **Caching**: Consider caching for frequently accessed data (dashboard stats, etc.)
8. **Real-time**: Consider SignalR for real-time updates (new orders, reports, etc.)

## 🔧 ASP.NET Core Controller Example

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

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
            _logger.LogError(ex, "Error fetching admin dashboard");
            
            return BadRequest(new ApiResponse<AdminDashboardStats>
            {
                Success = false,
                Message = "Failed to fetch dashboard statistics",
                Errors = new List<string> { ex.Message },
                StatusCode = 400
            });
        }
    }
}
```

---

**Last Updated**: December 2, 2025
